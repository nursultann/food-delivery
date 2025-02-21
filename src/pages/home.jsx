import React, { useState } from 'react';
import {
  AppBar,
  Badge,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';

const Home = () => {
  const menuItems = {
    пицца: [
      { id: 1, name: 'Маргарита', price: 599, category: 'пицца' },
      { id: 2, name: 'Пепперони', price: 699, category: 'пицца' },
    ],
    салаты: [
      { id: 3, name: 'Цезарь', price: 399, category: 'салаты' },
      { id: 4, name: 'Греческий', price: 349, category: 'салаты' },
    ],
    напитки: [
      { id: 5, name: 'Кола', price: 129, category: 'напитки' },
      { id: 6, name: 'Сок', price: 149, category: 'напитки' },
    ],
  };

  const [activeCategory, setActiveCategory] = useState('пицца');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    address: '',
    deliveryType: 'delivery'
  });

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
      showNotification(`${item.name} теперь в корзине: ${existingItem.quantity + 1} шт.`);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
      showNotification(`${item.name} добавлено в корзину`);
    }
  };

  const removeFromCart = (itemId) => {
    const itemToRemove = cart.find(item => item.id === itemId);
    setCart(cart.filter(item => item.id !== itemId));
    showNotification(`${itemToRemove.name} удалено из корзины`, 'error');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (!orderDetails.name || !orderDetails.address) {
      showNotification('Пожалуйста, заполните все обязательные поля', 'error');
      return;
    }

    const orderText = `*Новый заказ*%0A
Имя: ${orderDetails.name}%0A
Адрес: ${orderDetails.address}%0A
Тип доставки: ${orderDetails.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}%0A
%0A*Заказ:*%0A${cart.map(item => `${item.name} x${item.quantity} - ${item.price * item.quantity} сом`).join('%0A')}%0A
%0A*Итого: ${getTotalPrice()} сом*`;

    showNotification('Заказ оформлен! Переходим в WhatsApp...');

    setTimeout(() => {
      window.location.href = `https://wa.me/996709188440?text=${orderText}`;
    }, 1500);
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <Typography variant="h6">Наш Ресторан</Typography>
            <IconButton color="inherit" onClick={() => setShowCart(true)}>
              <Badge badgeContent={cart.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </div>
          <Tabs
            value={activeCategory}
            onChange={(e, newValue) => setActiveCategory(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {Object.keys(menuItems).map(category => (
              <Tab
                key={category}
                value={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {menuItems[activeCategory].map(item => (
            <Card key={item.id} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{item.name}</Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <Typography variant="h6" color="primary">{item.price} сом</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => addToCart(item)}
                  >
                    Добавить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Корзина */}
      <Dialog
        open={showCart}
        onClose={() => setShowCart(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Корзина
            <IconButton onClick={() => setShowCart(false)} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {cart.length === 0 ? (
            <Typography>Корзина пуста</Typography>
          ) : (
            <>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  <Typography>{item.name} x{item.quantity}</Typography>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Typography>{item.price * item.quantity}Сом</Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
              <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                Итого: {getTotalPrice()} сом
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            fullWidth
            disabled={cart.length === 0}
            onClick={() => {
              setShowCart(false);
              setShowCheckout(true);
            }}
          >
            Оформить заказ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Форма оформления заказа */}
      <Dialog
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Оформление заказа
            <IconButton onClick={() => setShowCheckout(false)} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField
              label="Имя"
              value={orderDetails.name}
              onChange={(e) => setOrderDetails({...orderDetails, name: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Адрес"
              value={orderDetails.address}
              onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
              fullWidth
              required
            />
            <FormControl>
              <Typography variant="subtitle1" gutterBottom>Тип доставки</Typography>
              <RadioGroup
                value={orderDetails.deliveryType}
                onChange={(e) => setOrderDetails({...orderDetails, deliveryType: e.target.value})}
              >
                <FormControlLabel value="delivery" control={<Radio />} label="Доставка" />
                <FormControlLabel value="pickup" control={<Radio />} label="Самовывоз" />
              </RadioGroup>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCheckout}
            disabled={!orderDetails.name || !orderDetails.address}
          >
            Отправить заказ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;