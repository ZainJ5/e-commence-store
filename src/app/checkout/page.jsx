'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CheckoutPage() {
  const [billingAddress, setBillingAddress] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'black',
    },
  };

  return (
    <Box sx={{ backgroundColor: '#f5f0e6', minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}>
          {/* Form Section */}
          <Box sx={{
            width: { xs: '100%', md: 'calc(100% - 400px)' },
            order: { xs: 1, md: 1 }
          }}>
            <Paper sx={{ p: 3 }}>
              {/* Contact Information */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact Information
              </Typography>
              <TextField
                fullWidth
                label="Email or Phone Number"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'black' } }, '& .MuiInputLabel-root.Mui-focused': { color: 'black' }, mb: 3 }}
              />
              {/* Shipping Address */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
                Shipping Address
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'black' } }, '& .MuiInputLabel-root.Mui-focused': { color: 'black' } }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'black' } }, '& .MuiInputLabel-root.Mui-focused': { color: 'black' } }}
                />
              </Box>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'black' } }, '& .MuiInputLabel-root.Mui-focused': { color: 'black' }, mb: 2 }}
              />
              <TextField
                fullWidth
                label="Apartment, suite, etc. (optional)"
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'black' } }, '& .MuiInputLabel-root.Mui-focused': { color: 'black' }, mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="City"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'black' } }, '& .MuiInputLabel-root.Mui-focused': { color: 'black' } }}
                />
                <TextField
                  fullWidth
                  label="Postal Code"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'black' } }, '& .MuiInputLabel-root.Mui-focused': { color: 'black' } }}
                />
              </Box>
              {/* Payment Method */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
                Payment Method
              </Typography>
              <RadioGroup defaultValue="cod">
                <FormControlLabel
                  value="cod"
                  control={<Radio sx={{ '&.Mui-checked': { color: 'black' } }} />}
                  label="Cash on Delivery (COD)"
                />
              </RadioGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ '&.Mui-checked': { color: 'black' } }}
                  />
                }
                label="Billing address same as shipping address"
                sx={{ mt: 2 }}
              />
            </Paper>
          </Box>
          {/* Order Summary */}
          <Box sx={{
            width: { xs: '100%', md: '400px' },
            order: { xs: 2, md: 1 },
            position: { md: 'sticky' },
            top: { md: '20px' },
            alignSelf: 'flex-start'
          }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              <Box sx={{ my: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Adi White Mehrnon Summer Tracksuit
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: M | Color: White
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: 1
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Rs 2,470.00
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>Rs 2,470.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>Rs 195.00</Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Rs 2,665.00</Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Lock />}
                sx={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                Complete Order
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>

  );
}

export default CheckoutPage;