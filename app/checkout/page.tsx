// frontend/app/checkout/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import OrderSummary from '../../components/checkout/OrderSummary'
import toast from 'react-hot-toast'
import { useCart } from '../../lib/hooks/useCart'
import { orderService } from '../../lib/services/api'
import { useAuth } from '../../lib/context/authContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { items, total, clearCart } = useCart()
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [selectedPayment, setSelectedPayment] = useState<'paystack' | 'transfer'>('paystack')
  const [isProcessing, setIsProcessing] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [paystackLoaded, setPaystackLoaded] = useState(false)
  const [paystackError, setPaystackError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [formData, setFormData] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: 'Nigeria',
    mobile: '',
    saveAsNew: true,
    deliveryInstructions: '',
    pickupTime: '',
  })

  // Load Paystack script directly
  useEffect(() => {
    const loadPaystackScript = () => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if ((window as any).PaystackPop) {
          console.log('✅ Paystack already loaded')
          setPaystackLoaded(true)
          resolve(true)
          return
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src*="paystack"]')
        if (existingScript) {
          console.log('📦 Paystack script already in DOM')
          existingScript.addEventListener('load', () => {
            console.log('✅ Existing Paystack script loaded')
            setPaystackLoaded(true)
            resolve(true)
          })
          existingScript.addEventListener('error', () => {
            console.error('❌ Existing Paystack script failed')
            setPaystackError('Paystack script failed to load')
            reject(new Error('Paystack script failed'))
          })
          return
        }

        // Create new script element
        const script = document.createElement('script')
        script.src = 'https://js.paystack.co/v1/inline.js'
        script.async = true
        script.id = 'paystack-script'
        
        script.onload = () => {
          console.log('✅ Paystack script loaded successfully')
          setPaystackLoaded(true)
          setPaystackError(null)
          resolve(true)
        }
        
        script.onerror = (err) => {
          console.error('❌ Paystack script failed to load:', err)
          setPaystackError('Failed to load payment system')
          reject(new Error('Failed to load Paystack'))
        }

        // Add to head for better reliability
        document.head.appendChild(script)
        
        // Fallback: Check after 5 seconds
        setTimeout(() => {
          if (!(window as any).PaystackPop) {
            console.warn('⚠️ Paystack loading timeout')
            setPaystackError('Payment system loading timeout')
            reject(new Error('Paystack loading timeout'))
          }
        }, 5000)
      })
    }

    // Load script when component mounts
    loadPaystackScript().catch((error) => {
      console.error('Failed to load Paystack:', error)
      toast.error('Payment system may not be available. Please try bank transfer.')
    })
  }, [])

  // Only redirect if auth is done loading and user is null
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to proceed to checkout')
      router.push('/login?callbackUrl=/checkout')
    }
  }, [authLoading, user, router])

  // Load user info and addresses when authenticated
  useEffect(() => {
    if (user && !authLoading) {
      loadUserData()
      loadUserAddresses()
    }
  }, [user, authLoading])

  const loadUserData = () => {
    if (user) {
      setUserInfo({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.mobile?.toString() || '',
      })
      
      setFormData(prev => ({
        ...prev,
        mobile: user.mobile?.toString() || '',
      }))
    }
  }

  const loadUserAddresses = async () => {
    if (!user) return
    
    try {
      setLoadingAddresses(true)
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          router.push('/login')
          return
        }
        throw new Error('Failed to load addresses')
      }

      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setAddresses(data.data)
        const defaultAddress = data.data.find((addr: any) => addr.status)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id)
          setFormData(prev => ({
            ...prev,
            address_line: defaultAddress.address_line,
            city: defaultAddress.city,
            state: defaultAddress.state,
            pincode: defaultAddress.pincode,
            country: defaultAddress.country,
            mobile: defaultAddress.mobile?.toString() || prev.mobile,
          }))
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setLoadingAddresses(false)
    }
  }

  const saveAddress = async () => {
    try {
      if (orderType === 'delivery') {
        if (!formData.address_line || !formData.city || !formData.state || !formData.pincode) {
          toast.error('Please fill in all required address fields')
          return null
        }
      }

      let addressId = selectedAddressId

      if (formData.saveAsNew || !selectedAddressId) {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('Authentication required')
          return null
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            address_line: formData.address_line,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
            mobile: formData.mobile || userInfo.phone,
          })
        })

        const data = await response.json()
        if (data.success) {
          addressId = data.data._id
          toast.success('Address saved successfully')
          loadUserAddresses()
        } else {
          toast.error(data.message || 'Failed to save address')
          return null
        }
      }

      return addressId
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Failed to save address')
      return null
    }
  }

  // const handlePayment = async () => {
  //   if (!user) {
  //     toast.error('Please sign in to proceed to payment')
  //     router.push('/login?callbackUrl=/checkout')
  //     return
  //   }

  //   if (items.length === 0) {
  //     toast.error('Your cart is empty')
  //     return
  //   }

  //   if (!userInfo.firstName || !userInfo.email || !userInfo.phone) {
  //     toast.error('Please fill in all required personal information')
  //     return
  //   }

  //   setIsProcessing(true)

  //   try {
  //     let addressId = selectedAddressId

  //     if (orderType === 'delivery') {
  //       addressId = await saveAddress()
  //       if (!addressId) {
  //         setIsProcessing(false)
  //         return
  //       }
  //     } else {
  //       addressId = 'pickup'
  //     }

  //     const token = localStorage.getItem('token')
  //     if (!token) {
  //       toast.error('Authentication required')
  //       setIsProcessing(false)
  //       return
  //     }

  //     const orderData = {
  //       delivery_address: addressId,
  //       payment_method: selectedPayment === 'paystack' ? 'card' : 'transfer',
  //       notes: formData.deliveryInstructions || '',
  //       pickup_time: orderType === 'pickup' ? formData.pickupTime : undefined,
  //     }

  //     const orderResponse = await orderService.createOrder(orderData)
      
  //     if (!orderResponse.success) {
  //       throw new Error(orderResponse.message || 'Failed to create order')
  //     }

  //     const order = orderResponse.data

  //     if (selectedPayment === 'paystack') {
  //       await handlePaystackPayment(order)
  //     } else {
  //       router.push(`/checkout/transfer?order=${order.orderId}`)
  //     }

  //   } catch (error: any) {
  //     console.error('Checkout error:', error)
  //     toast.error(error.message || 'Checkout failed. Please try again.')
  //     setIsProcessing(false)
  //   }
  // }

  
  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to proceed to payment');
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    console.log('🛒 Cart items before checkout:', {
      items: items,
      count: items.length,
      total: total,
      firstItem: items[0] // Show first item for debugging
    });

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!userInfo.firstName || !userInfo.email || !userInfo.phone) {
      toast.error('Please fill in all required personal information');
      return;
    }

    setIsProcessing(true);

    try {
      let addressId = selectedAddressId;

      if (orderType === 'delivery') {
        addressId = await saveAddress();
        if (!addressId) {
          setIsProcessing(false);
          return;
        }
      } else {
        addressId = 'pickup';
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        setIsProcessing(false);
        return;
      }

      // DEBUG: Check if items have proper product IDs
      console.log('🔍 Checking cart item IDs:', items.map(item => ({
        id: item.id,
        name: item.name,
        idLength: item.id?.length,
        isObjectId: /^[0-9a-fA-F]{24}$/.test(item.id) // Check if it looks like MongoDB ObjectId
      })));

      // Prepare cart items for backend
      const cartItemsForBackend = items.map(item => ({
        productId: item.id, // This MUST be the actual MongoDB product _id
        quantity: item.quantity,
        name: item.name, // Include for debugging
        price: item.price // Include for debugging
      }));

      const orderData = {
        delivery_address: addressId,
        payment_method: selectedPayment === 'paystack' ? 'card' : 'transfer',
        notes: formData.deliveryInstructions || '',
        pickup_time: orderType === 'pickup' ? formData.pickupTime : undefined,
        cartItems: cartItemsForBackend
      };

      console.log('📦 Sending order data to backend:', {
        ...orderData,
        cartItemsCount: cartItemsForBackend.length,
        cartItems: cartItemsForBackend
      });

      // Call order service
      const orderResponse = await orderService.createOrder(orderData);
      
      console.log('✅ Order response from backend:', orderResponse);
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const order = orderResponse.data;

      if (selectedPayment === 'paystack') {
        await handlePaystackPayment(order);
      } else {
        router.push(`/checkout/transfer?order=${order.orderId}`);
      }

    } catch (error: any) {
      console.error('❌ Checkout error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      // Show more specific error messages
      let errorMessage = error.message || 'Checkout failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes('Cart is empty')) {
        errorMessage = 'Your cart appears to be empty. Please add items to your cart.';
      } else if (error.message?.includes('Product not found')) {
        errorMessage = 'One or more products in your cart are no longer available. Please update your cart.';
      }
      
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  // const handlePaystackPayment = async (order: any) => {
  //   const deliveryFee = orderType === 'pickup' ? 0 : total > 50000 ? 0 : 5000
  //   const tax = total * 0.075
  //   const grandTotal = total + deliveryFee + tax

  //   return new Promise((resolve, reject) => {
  //     // Function to check if Paystack is ready
  //     const checkPaystackReady = () => {
  //       if (typeof window === 'undefined') {
  //         return { ready: false, error: 'Window object not available' }
  //       }
        
  //       const paystack = (window as any).PaystackPop
  //       if (!paystack) {
  //         return { ready: false, error: 'Payment gateway not loaded' }
  //       }
        
  //       if (!paystack.setup) {
  //         return { ready: false, error: 'Paystack setup function not available' }
  //       }
        
  //       return { ready: true, paystack }
  //     }

  //     // Initialize payment
  //     const initPayment = () => {
  //       try {
  //         const checkResult = checkPaystackReady()
  //         if (!checkResult.ready) {
  //           toast.error(`Payment system error: ${checkResult.error}`)
  //           setIsProcessing(false)
  //           reject(new Error(checkResult.error))
  //           return
  //         }

  //         const paystack = checkResult.paystack
          
  //         // Validate required fields
  //         if (!userInfo.email) {
  //           toast.error('Email is required for payment')
  //           setIsProcessing(false)
  //           reject(new Error('Email required'))
  //           return
  //         }

  //         if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
  //           toast.error('Payment configuration error')
  //           setIsProcessing(false)
  //           reject(new Error('Paystack public key not configured'))
  //           return
  //         }

  //         // Setup Paystack payment
  //         const handler = paystack.setup({
  //           key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  //           email: userInfo.email,
  //           amount: Math.round(grandTotal * 100), // Convert to kobo
  //           currency: 'NGN',
  //           ref: order.orderId,
  //           metadata: {
  //             customer_name: `${userInfo.firstName} ${userInfo.lastName}`,
  //             customer_phone: userInfo.phone,
  //             order_type: orderType,
  //             order_id: order.orderId,
  //           },
  //           callback: async (response: any) => {
  //             try {
  //               console.log('📞 Paystack callback received:', response)
                
  //               // Verify payment with backend
  //               const verifyResponse = await orderService.verifyPayment(response.reference)
                
  //               if (verifyResponse.success) {
  //                 // Clear cart
  //                 clearCart()
  //                 toast.success('Payment successful!')
  //                 router.push(`/checkout/success?order=${order.orderId}`)
  //                 resolve(true)
  //               } else {
  //                 toast.error('Payment verification failed. Please contact support.')
  //                 setIsProcessing(false)
  //                 reject(new Error('Payment verification failed'))
  //               }
  //             } catch (error: any) {
  //               console.error('Payment verification error:', error)
  //               toast.error('Payment verification error: ' + (error.message || 'Unknown error'))
  //               setIsProcessing(false)
  //               reject(error)
  //             }
  //           },
  //           onClose: () => {
  //             console.log('❌ Paystack payment window closed by user')
  //             toast.error('Payment was cancelled')
  //             setIsProcessing(false)
  //             resolve(false)
  //           }
  //         })

  //         // Open payment iframe
  //         console.log('🚀 Opening Paystack payment...')
  //         handler.openIframe()
          
  //       } catch (error: any) {
  //         console.error('Paystack initialization error:', error)
  //         toast.error('Payment initialization failed: ' + error.message)
  //         setIsProcessing(false)
  //         reject(error)
  //       }
  //     }

  //     // Check if Paystack is ready
  //     const checkResult = checkPaystackReady()
      
  //     if (!checkResult.ready) {
  //       console.warn('⚠️ Paystack not ready:', checkResult.error)
        
  //       // Try to load script dynamically if not loaded
  //       if (!paystackLoaded && !paystackError) {
  //         toast.info('Loading payment system...')
          
  //         const script = document.createElement('script')
  //         script.src = 'https://js.paystack.co/v1/inline.js'
  //         script.async = true
          
  //         script.onload = () => {
  //           console.log('✅ Paystack dynamically loaded')
  //           setPaystackLoaded(true)
  //           setPaystackError(null)
  //           setTimeout(initPayment, 1000) // Give it a moment to initialize
  //         }
          
  //         script.onerror = () => {
  //           toast.error('Failed to load payment system. Please try bank transfer.')
  //           setIsProcessing(false)
  //           reject(new Error('Paystack script failed to load'))
  //         }
          
  //         document.head.appendChild(script)
  //       } else {
  //         toast.error('Payment system not available. Please try bank transfer.')
  //         setIsProcessing(false)
  //         reject(new Error(checkResult.error))
  //       }
  //       return
  //     }

  //     // Paystack is ready, proceed with payment
  //     initPayment()
  //   })
  // }


  // app/checkout/page.tsx - Updated handlePaystackPayment function
  // const handlePaystackPayment = async (order: any) => {
  //   const deliveryFee = orderType === 'pickup' ? 0 : total > 50000 ? 0 : 5000;
  //   const tax = total * 0.075;
  //   const grandTotal = total + deliveryFee + tax;

  //   return new Promise((resolve, reject) => {
  //     // Function to check if Paystack is ready
  //     const checkPaystackReady = () => {
  //       if (typeof window === 'undefined') {
  //         return { ready: false, error: 'Window object not available' };
  //       }
        
  //       const paystack = (window as any).PaystackPop;
  //       if (!paystack) {
  //         return { ready: false, error: 'Payment gateway not loaded' };
  //       }
        
  //       if (!paystack.setup || typeof paystack.setup !== 'function') {
  //         return { ready: false, error: 'Paystack setup function not available' };
  //       }
        
  //       return { ready: true, paystack };
  //     };

  //     // Initialize payment
  //     const initPayment = () => {
  //       try {
  //         const checkResult = checkPaystackReady();
  //         if (!checkResult.ready) {
  //           toast.error(`Payment system error: ${checkResult.error}`);
  //           setIsProcessing(false);
  //           reject(new Error(checkResult.error));
  //           return;
  //         }

  //         const paystack = checkResult.paystack;
          
  //         // Validate required fields
  //         if (!userInfo.email) {
  //           toast.error('Email is required for payment');
  //           setIsProcessing(false);
  //           reject(new Error('Email required'));
  //           return;
  //         }

  //         if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
  //           toast.error('Payment configuration error');
  //           setIsProcessing(false);
  //           reject(new Error('Paystack public key not configured'));
  //           return;
  //         }

  //         // Create a proper callback function
  //         const paymentCallback = async (response: any) => {
  //           try {
  //             console.log('📞 Paystack callback received:', response);
              
  //             // Verify payment with backend
  //             const verifyResponse = await orderService.verifyPayment(response.reference);
              
  //             if (verifyResponse.success) {
  //               // Clear cart
  //               clearCart();
  //               toast.success('Payment successful!');
  //               router.push(`/checkout/success?order=${order.orderId}`);
  //               resolve(true);
  //             } else {
  //               toast.error('Payment verification failed. Please contact support.');
  //               setIsProcessing(false);
  //               reject(new Error('Payment verification failed'));
  //             }
  //           } catch (error: any) {
  //             console.error('Payment verification error:', error);
  //             toast.error('Payment verification error: ' + (error.message || 'Unknown error'));
  //             setIsProcessing(false);
  //             reject(error);
  //           }
  //         };

  //         // Create a proper onClose function
  //         const paymentOnClose = () => {
  //           console.log('❌ Paystack payment window closed by user');
  //           toast.error('Payment was cancelled');
  //           setIsProcessing(false);
  //           resolve(false);
  //         };

  //         // Setup Paystack payment with proper functions
  //         const handler = paystack.setup({
  //           key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  //           email: userInfo.email,
  //           amount: Math.round(grandTotal * 100), // Convert to kobo
  //           currency: 'NGN',
  //           ref: order.orderId,
  //           metadata: {
  //             customer_name: `${userInfo.firstName} ${userInfo.lastName}`,
  //             customer_phone: userInfo.phone,
  //             order_type: orderType,
  //             order_id: order.orderId,
  //           },
  //           callback: paymentCallback, // Use the defined function
  //           onClose: paymentOnClose // Use the defined function
  //         });

  //         // Open payment iframe
  //         console.log('🚀 Opening Paystack payment...');
  //         handler.openIframe();
          
  //       } catch (error: any) {
  //         console.error('Paystack initialization error:', error);
  //         toast.error('Payment initialization failed: ' + error.message);
  //         setIsProcessing(false);
  //         reject(error);
  //       }
  //     };

  //     // Check if Paystack is ready
  //     const checkResult = checkPaystackReady();
      
  //     if (!checkResult.ready) {
  //       console.warn('⚠️ Paystack not ready:', checkResult.error);
        
  //       // Try to load script dynamically if not loaded
  //       if (!paystackLoaded && !paystackError) {
  //         toast.info('Loading payment system...');
          
  //         const script = document.createElement('script');
  //         script.src = 'https://js.paystack.co/v1/inline.js';
  //         script.async = true;
          
  //         script.onload = () => {
  //           console.log('✅ Paystack dynamically loaded');
  //           setPaystackLoaded(true);
  //           setPaystackError(null);
  //           setTimeout(initPayment, 1000); // Give it a moment to initialize
  //         };
          
  //         script.onerror = () => {
  //           toast.error('Failed to load payment system. Please try bank transfer.');
  //           setIsProcessing(false);
  //           reject(new Error('Paystack script failed to load'));
  //         };
          
  //         document.head.appendChild(script);
  //       } else {
  //         toast.error('Payment system not available. Please try bank transfer.');
  //         setIsProcessing(false);
  //         reject(new Error(checkResult.error));
  //       }
  //       return;
  //     }

  //     // Paystack is ready, proceed with payment
  //     initPayment();
  //   });
  // };

  const handlePaystackPayment = async (order: any) => {
    const deliveryFee = orderType === 'pickup' ? 0 : total > 50000 ? 0 : 5000;
    const tax = total * 0.075;
    const grandTotal = total + deliveryFee + tax;

    // Check if Paystack is loaded
    if (!(window as any).PaystackPop) {
      toast.error('Payment system not loaded. Please refresh and try again.');
      setIsProcessing(false);
      return;
    }

    const paystack = (window as any).PaystackPop;

    try {
      const handler = paystack.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: userInfo.email,
        amount: Math.round(grandTotal * 100),
        currency: 'NGN',
        ref: order.orderId,
        metadata: {
          customer_name: `${userInfo.firstName} ${userInfo.lastName}`,
          customer_phone: userInfo.phone,
          order_type: orderType,
          order_id: order.orderId,
        },
        callback: function(response: any) {
          console.log('Payment callback:', response);
          // Handle success
          orderService.verifyPayment(response.reference)
            .then(verifyResponse => {
              if (verifyResponse.success) {
                clearCart();
                toast.success('Payment successful!');
                router.push(`/checkout/success?order=${order.orderId}`);
              }
            })
            .catch(error => {
              toast.error('Payment verification failed');
              setIsProcessing(false);
            });
        },
        onClose: function() {
          console.log('Payment window closed');
          toast.error('Payment was cancelled');
          setIsProcessing(false);
        }
      });

      handler.openIframe();
    } catch (error: any) {
      console.error('Paystack error:', error);
      toast.error('Payment initialization failed');
      setIsProcessing(false);
    }
  };




  const updateUserInfo = (data: Partial<typeof userInfo>) => {
    setUserInfo(prev => ({ ...prev, ...data }))
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    const selectedAddress = addresses.find(addr => addr._id === addressId)
    if (selectedAddress) {
      setFormData(prev => ({
        ...prev,
        address_line: selectedAddress.address_line,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country,
        mobile: selectedAddress.mobile?.toString() || prev.mobile,
        saveAsNew: false,
      }))
    }
  }

  const syncCartToDatabase = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        return false
      }
      
      console.log('🔄 Syncing cart to database...', items)
      
      // First, clear existing cart
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {
        // Ignore clear errors
      })
      
      // Add each item
      for (const item of items) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: item.id, // IMPORTANT: item.id must be actual product ID
            quantity: item.quantity
          })
        })
        
        if (!response.ok) {
          console.error('Failed to add item:', item)
          return false
        }
      }
      
      console.log('✅ Cart synced to database')
      return true
    } catch (error) {
      console.error('Cart sync error:', error)
      return false
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pepe-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show sign in prompt if not authenticated (after loading)
  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600">Complete your order securely</p>
              </div>
              <div className="text-sm text-gray-500">
                Signed in as <span className="font-medium text-gray-900">{userInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Payment System Status (Debug) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${paystackLoaded ? 'bg-green-500' : paystackError ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <span>Paystack: {paystackLoaded ? '✅ Loaded' : paystackError ? `❌ ${paystackError}` : '⏳ Loading...'}</span>
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setOrderType('delivery')}
                disabled={isProcessing}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  orderType === 'delivery' 
                    ? 'bg-pepe-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                🚚 Delivery
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                disabled={isProcessing}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  orderType === 'pickup' 
                    ? 'bg-pepe-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                🏪 Pickup
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Your Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={userInfo.firstName}
                          onChange={(e) => updateUserInfo({ firstName: e.target.value })}
                          required
                          disabled={isProcessing}
                          className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                            isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                          }`}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={userInfo.lastName}
                          onChange={(e) => updateUserInfo({ lastName: e.target.value })}
                          required
                          disabled={isProcessing}
                          className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                            isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                          }`}
                          placeholder="Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => updateUserInfo({ email: e.target.value })}
                          required
                          disabled={isProcessing}
                          className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                            isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                          }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) => updateUserInfo({ phone: e.target.value })}
                          required
                          disabled={isProcessing}
                          className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                            isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                          }`}
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                      
                      {loadingAddresses ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pepe-primary mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Loading addresses...</p>
                        </div>
                      ) : addresses.length > 0 ? (
                        <div className="mb-6">
                          <h3 className="font-medium text-gray-700 mb-3">Select a saved address</h3>
                          <div className="space-y-3">
                            {addresses.map((address) => (
                              <div
                                key={address._id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                  selectedAddressId === address._id
                                    ? 'border-pepe-primary bg-pepe-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleAddressSelect(address._id)}
                              >
                                <div className="flex items-start">
                                  <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-1 ${
                                    selectedAddressId === address._id
                                      ? 'border-pepe-primary bg-pepe-primary'
                                      : 'border-gray-300'
                                  }`}>
                                    {selectedAddressId === address._id && (
                                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                                    )}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between">
                                      <p className="font-medium text-gray-900">
                                        {address.address_line}, {address.city}
                                      </p>
                                      {address.status && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {address.city}, {address.state} {address.pincode}
                                    </p>
                                    <p className="text-sm text-gray-600">{address.country}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedAddressId(null)
                                setFormData(prev => ({
                                  ...prev,
                                  address_line: '',
                                  city: '',
                                  state: '',
                                  pincode: '',
                                  country: 'Nigeria',
                                  saveAsNew: true,
                                }))
                              }}
                              className="text-pepe-primary hover:text-pepe-dark text-sm font-medium"
                            >
                              + Add new address
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-4">No saved addresses found</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={formData.address_line}
                            onChange={(e) => updateFormData({ address_line: e.target.value })}
                            required
                            disabled={isProcessing}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                              isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                            }`}
                            placeholder="123 Main Street"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => updateFormData({ city: e.target.value })}
                              required
                              disabled={isProcessing}
                              className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                                isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                              }`}
                              placeholder="Lagos"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) => updateFormData({ state: e.target.value })}
                              required
                              disabled={isProcessing}
                              className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                                isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                              }`}
                              placeholder="Lagos State"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              value={formData.pincode}
                              onChange={(e) => updateFormData({ pincode: e.target.value })}
                              required
                              disabled={isProcessing}
                              className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                                isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                              }`}
                              placeholder="100001"
                            />
                          </div>
                        </div>

                        <div className="flex items-center mt-4">
                          <input
                            type="checkbox"
                            id="saveAsNew"
                            checked={formData.saveAsNew}
                            onChange={(e) => updateFormData({ saveAsNew: e.target.checked })}
                            disabled={isProcessing || !!selectedAddressId}
                            className={`w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary focus:ring-2 ${
                              isProcessing || selectedAddressId ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <label htmlFor="saveAsNew" className={`ml-3 text-sm ${
                            isProcessing || selectedAddressId ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                          }`}>
                            Save this address to my account
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      {orderType === 'delivery' ? 'Delivery Instructions' : 'Pickup Information'}
                    </h2>
                    
                    {orderType === 'delivery' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          value={formData.deliveryInstructions}
                          onChange={(e) => updateFormData({ deliveryInstructions: e.target.value })}
                          disabled={isProcessing}
                          rows={3}
                          className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none ${
                            isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                          }`}
                          placeholder="Leave at the gate, call when you arrive, etc."
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                          <div className="flex items-center">
                            <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">Pickup Location</p>
                              <p className="text-sm text-gray-600">Pepe's Café & Brunch, 123 Food Street, Lagos</p>
                            </div>
                          </div>
                        </div>
                        
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Pickup Time *
                        </label>
                        <select
                          value={formData.pickupTime}
                          onChange={(e) => updateFormData({ pickupTime: e.target.value })}
                          required
                          disabled={isProcessing}
                          className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                            isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select pickup time</option>
                          <option value="asap">ASAP (15-20 minutes)</option>
                          <option value="30min">30 minutes from now</option>
                          <option value="1hour">1 hour from now</option>
                          <option value="2hours">2 hours from now</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <OrderSummary 
                  orderType={orderType}
                  selectedPayment={selectedPayment}
                  isProcessing={isProcessing}
                  onPayment={handlePayment}
                  onPaymentMethodChange={setSelectedPayment}
                  items={items}
                  total={total}
                  paystackReady={paystackLoaded && !paystackError}
                />

 
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
































































// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Header from '../../components/layout/Header'
// import Footer from '../../components/layout/Footer'
// import OrderSummary from '../../components/checkout/OrderSummary'
// import PaystackLoader from '../../components/checkout/PaystackLoader'
// import toast from 'react-hot-toast'
// import { useCart } from '../../lib/hooks/useCart'
// import { orderService } from '../../lib/services/api'
// import { useAuth } from '../../lib/context/authContext'

// export default function CheckoutPage() {
//   const router = useRouter()
//   const { user, isLoading: authLoading } = useAuth() // Remove checkAuth
//   const { items, total, clearCart } = useCart()
//   const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
//   const [selectedPayment, setSelectedPayment] = useState<'paystack' | 'transfer'>('paystack')
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [addresses, setAddresses] = useState<any[]>([])
//   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
//   const [loadingAddresses, setLoadingAddresses] = useState(true)
//   const [userInfo, setUserInfo] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//   })
//   const [formData, setFormData] = useState({
//     address_line: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country: 'Nigeria',
//     mobile: '',
//     saveAsNew: true,
//     deliveryInstructions: '',
//     pickupTime: '',
//   })

//   // Only redirect if auth is done loading and user is null
//   useEffect(() => {
//     if (!authLoading && !user) {
//       toast.error('Please sign in to proceed to checkout')
//       router.push('/login?callbackUrl=/checkout')
//     }
//   }, [authLoading, user, router])




//   // Load user info and addresses when authenticated
//   useEffect(() => {
//     if (user && !authLoading) {
//       loadUserData()
//       loadUserAddresses()
//     }
//   }, [user, authLoading])

//   const loadUserData = () => {
//     if (user) {
//       setUserInfo({
//         firstName: user.name?.split(' ')[0] || '',
//         lastName: user.name?.split(' ').slice(1).join(' ') || '',
//         email: user.email || '',
//         phone: user.mobile?.toString() || '',
//       })
      
//       setFormData(prev => ({
//         ...prev,
//         mobile: user.mobile?.toString() || '',
//       }))
//     }
//   }

//   const loadUserAddresses = async () => {
//     if (!user) return;
    
//     try {
//       setLoadingAddresses(true)
//       const token = localStorage.getItem('token')
//       if (!token) {
//         toast.error('Authentication required')
//         return
//       }

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })
      
//       if (!response.ok) {
//         if (response.status === 401) {
//           // Token expired, redirect to login
//           toast.error('Session expired. Please log in again.')
//           localStorage.removeItem('token')
//           localStorage.removeItem('user')
//           localStorage.removeItem('refreshToken')
//           router.push('/login')
//           return
//         }
//         throw new Error('Failed to load addresses')
//       }

//       const data = await response.json()
//       if (data.success && data.data.length > 0) {
//         setAddresses(data.data)
//         const defaultAddress = data.data.find((addr: any) => addr.status)
//         if (defaultAddress) {
//           setSelectedAddressId(defaultAddress._id)
//           setFormData(prev => ({
//             ...prev,
//             address_line: defaultAddress.address_line,
//             city: defaultAddress.city,
//             state: defaultAddress.state,
//             pincode: defaultAddress.pincode,
//             country: defaultAddress.country,
//             mobile: defaultAddress.mobile?.toString() || prev.mobile,
//           }))
//         }
//       }
//     } catch (error) {
//       console.error('Error loading addresses:', error)
//       toast.error('Failed to load addresses')
//     } finally {
//       setLoadingAddresses(false)
//     }
//   }

//   const saveAddress = async () => {
//     try {
//       if (orderType === 'delivery') {
//         if (!formData.address_line || !formData.city || !formData.state || !formData.pincode) {
//           toast.error('Please fill in all required address fields')
//           return null
//         }
//       }

//       let addressId = selectedAddressId

//       if (formData.saveAsNew || !selectedAddressId) {
//         const token = localStorage.getItem('token')
//         if (!token) {
//           toast.error('Authentication required')
//           return null
//         }

//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
//           method: 'POST',
//           headers: { 
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             address_line: formData.address_line,
//             city: formData.city,
//             state: formData.state,
//             pincode: formData.pincode,
//             country: formData.country,
//             mobile: formData.mobile || userInfo.phone,
//           })
//         })

//         const data = await response.json()
//         if (data.success) {
//           addressId = data.data._id
//           toast.success('Address saved successfully')
//           loadUserAddresses()
//         } else {
//           toast.error(data.message || 'Failed to save address')
//           return null
//         }
//       }

//       return addressId
//     } catch (error) {
//       console.error('Error saving address:', error)
//       toast.error('Failed to save address')
//       return null
//     }
//   }

//   const handlePayment = async () => {
//     if (!user) {
//       toast.error('Please sign in to proceed to payment')
//       router.push('/login?callbackUrl=/checkout')
//       return
//     }

//     if (items.length === 0) {
//       toast.error('Your cart is empty')
//       return
//     }

//     if (!userInfo.firstName || !userInfo.email || !userInfo.phone) {
//       toast.error('Please fill in all required personal information')
//       return
//     }

//     setIsProcessing(true)

//     try {
//       let addressId = selectedAddressId

//       if (orderType === 'delivery') {
//         addressId = await saveAddress()
//         if (!addressId) {
//           setIsProcessing(false)
//           return
//         }
//       } else {
//         addressId = 'pickup'
//       }

//       const token = localStorage.getItem('token')
//       if (!token) {
//         toast.error('Authentication required')
//         setIsProcessing(false)
//         return
//       }

//       const orderData = {
//         delivery_address: addressId,
//         payment_method: selectedPayment === 'paystack' ? 'card' : 'transfer',
//         notes: formData.deliveryInstructions || '',
//         pickup_time: orderType === 'pickup' ? formData.pickupTime : undefined,
//       }

//       const orderResponse = await orderService.createOrder(orderData)
      
//       if (!orderResponse.success) {
//         throw new Error(orderResponse.message || 'Failed to create order')
//       }

//       const order = orderResponse.data

//       if (selectedPayment === 'paystack') {
//         await handlePaystackPayment(order)
//       } else {
//         router.push(`/checkout/transfer?order=${order.orderId}`)
//       }

//     } catch (error: any) {
//       console.error('Checkout error:', error)
//       toast.error(error.message || 'Checkout failed. Please try again.')
//       setIsProcessing(false)
//     }
//   }

//   const handlePaystackPayment = async (order: any) => {
//     const deliveryFee = orderType === 'pickup' ? 0 : total > 10000 ? 0 : 1000
//     const tax = total * 0.075
//     const grandTotal = total + deliveryFee + tax

//     return new Promise((resolve, reject) => {
//       if (typeof window === 'undefined' || !(window as any).PaystackPop) {
//         toast.error('Payment system not ready. Please refresh the page.')
//         reject(new Error('Payment gateway not loaded'))
//         return
//       }

//       const handler = (window as any).PaystackPop.setup({
//         key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
//         email: userInfo.email,
//         amount: Math.round(grandTotal * 100),
//         currency: 'NGN',
//         ref: order.orderId,
//         metadata: {
//           customer_name: `${userInfo.firstName} ${userInfo.lastName}`,
//           customer_phone: userInfo.phone,
//           order_type: orderType,
//         },
//         callback: async (response: any) => {
//           try {
//             const verifyResponse = await orderService.verifyPayment(response.reference)
            
//             if (verifyResponse.success) {
//               clearCart()
//               toast.success('Payment successful!')
//               router.push(`/checkout/success?order=${order.orderId}`)
//               resolve(true)
//             } else {
//               toast.error('Payment verification failed. Please contact support.')
//               reject(new Error('Payment verification failed'))
//             }
//           } catch (error) {
//             console.error('Payment verification error:', error)
//             toast.error('Payment verification error. Please contact support.')
//             reject(error)
//           }
//         },
//         onClose: () => {
//           toast.error('Payment was cancelled')
//           setIsProcessing(false)
//           resolve(false)
//         }
//       })

//       handler.openIframe()
//     })
//   }

//   const updateUserInfo = (data: Partial<typeof userInfo>) => {
//     setUserInfo(prev => ({ ...prev, ...data }))
//   }

//   const updateFormData = (data: Partial<typeof formData>) => {
//     setFormData(prev => ({ ...prev, ...data }))
//   }

//   const handleAddressSelect = (addressId: string) => {
//     setSelectedAddressId(addressId)
//     const selectedAddress = addresses.find(addr => addr._id === addressId)
//     if (selectedAddress) {
//       setFormData(prev => ({
//         ...prev,
//         address_line: selectedAddress.address_line,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         pincode: selectedAddress.pincode,
//         country: selectedAddress.country,
//         mobile: selectedAddress.mobile?.toString() || prev.mobile,
//         saveAsNew: false,
//       }))
//     }
//   }

//   // Show loading while checking authentication
//   if (authLoading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pepe-primary mx-auto"></div>
//             <p className="mt-4 text-gray-600">Checking authentication...</p>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   // Show sign in prompt if not authenticated (after loading)
//   if (!user) {
//     return null // Will redirect in useEffect
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <PaystackLoader />
//       <Header />
      
//       <main className="flex-grow py-8">
//         <div className="container mx-auto px-4">
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
//                 <p className="text-gray-600">Complete your order securely</p>
//               </div>
//               <div className="text-sm text-gray-500">
//                 Signed in as <span className="font-medium text-gray-900">{userInfo.email}</span>
//               </div>
//             </div>
//           </div>

//           <div className="max-w-3xl mx-auto mb-8">
//             <div className="flex border border-gray-300 rounded-xl overflow-hidden">
//               <button
//                 onClick={() => setOrderType('delivery')}
//                 disabled={isProcessing}
//                 className={`flex-1 py-4 text-center font-medium transition-colors ${
//                   orderType === 'delivery' 
//                     ? 'bg-pepe-primary text-white' 
//                     : 'bg-white text-gray-700 hover:bg-gray-50'
//                 } disabled:opacity-50`}
//               >
//                 🚚 Delivery
//               </button>
//               <button
//                 onClick={() => setOrderType('pickup')}
//                 disabled={isProcessing}
//                 className={`flex-1 py-4 text-center font-medium transition-colors ${
//                   orderType === 'pickup' 
//                     ? 'bg-pepe-primary text-white' 
//                     : 'bg-white text-gray-700 hover:bg-gray-50'
//                 } disabled:opacity-50`}
//               >
//                 🏪 Pickup
//               </button>
//             </div>
//           </div>

//           <div className="max-w-6xl mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2">
//                 <div className="space-y-8">
//                   <div className="bg-white rounded-2xl shadow-sm p-6">
//                     <h2 className="text-xl font-bold text-gray-900 mb-6">Your Information</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           First Name *
//                         </label>
//                         <input
//                           type="text"
//                           value={userInfo.firstName}
//                           onChange={(e) => updateUserInfo({ firstName: e.target.value })}
//                           required
//                           disabled={isProcessing}
//                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                           }`}
//                           placeholder="John"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Last Name *
//                         </label>
//                         <input
//                           type="text"
//                           value={userInfo.lastName}
//                           onChange={(e) => updateUserInfo({ lastName: e.target.value })}
//                           required
//                           disabled={isProcessing}
//                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                           }`}
//                           placeholder="Doe"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Email *
//                         </label>
//                         <input
//                           type="email"
//                           value={userInfo.email}
//                           onChange={(e) => updateUserInfo({ email: e.target.value })}
//                           required
//                           disabled={isProcessing}
//                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                           }`}
//                           placeholder="john@example.com"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number *
//                         </label>
//                         <input
//                           type="tel"
//                           value={userInfo.phone}
//                           onChange={(e) => updateUserInfo({ phone: e.target.value })}
//                           required
//                           disabled={isProcessing}
//                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                           }`}
//                           placeholder="+234 800 000 0000"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {orderType === 'delivery' && (
//                     <div className="bg-white rounded-2xl shadow-sm p-6">
//                       <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                      
//                       {loadingAddresses ? (
//                         <div className="text-center py-4">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pepe-primary mx-auto"></div>
//                           <p className="mt-2 text-sm text-gray-600">Loading addresses...</p>
//                         </div>
//                       ) : addresses.length > 0 ? (
//                         <div className="mb-6">
//                           <h3 className="font-medium text-gray-700 mb-3">Select a saved address</h3>
//                           <div className="space-y-3">
//                             {addresses.map((address) => (
//                               <div
//                                 key={address._id}
//                                 className={`p-4 border rounded-lg cursor-pointer transition-all ${
//                                   selectedAddressId === address._id
//                                     ? 'border-pepe-primary bg-pepe-primary/5'
//                                     : 'border-gray-200 hover:border-gray-300'
//                                 }`}
//                                 onClick={() => handleAddressSelect(address._id)}
//                               >
//                                 <div className="flex items-start">
//                                   <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-1 ${
//                                     selectedAddressId === address._id
//                                       ? 'border-pepe-primary bg-pepe-primary'
//                                       : 'border-gray-300'
//                                   }`}>
//                                     {selectedAddressId === address._id && (
//                                       <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
//                                     )}
//                                   </div>
//                                   <div className="flex-grow">
//                                     <div className="flex justify-between">
//                                       <p className="font-medium text-gray-900">
//                                         {address.address_line}, {address.city}
//                                       </p>
//                                       {address.status && (
//                                         <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                                           Default
//                                         </span>
//                                       )}
//                                     </div>
//                                     <p className="text-sm text-gray-600 mt-1">
//                                       {address.city}, {address.state} {address.pincode}
//                                     </p>
//                                     <p className="text-sm text-gray-600">{address.country}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                           <div className="mt-4 text-center">
//                             <button
//                               onClick={() => {
//                                 setSelectedAddressId(null)
//                                 setFormData(prev => ({
//                                   ...prev,
//                                   address_line: '',
//                                   city: '',
//                                   state: '',
//                                   pincode: '',
//                                   country: 'Nigeria',
//                                   saveAsNew: true,
//                                 }))
//                               }}
//                               className="text-pepe-primary hover:text-pepe-dark text-sm font-medium"
//                             >
//                               + Add new address
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-center py-6">
//                           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                             </svg>
//                           </div>
//                           <p className="text-gray-600 mb-4">No saved addresses found</p>
//                         </div>
//                       )}

//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Street Address *
//                           </label>
//                           <input
//                             type="text"
//                             value={formData.address_line}
//                             onChange={(e) => updateFormData({ address_line: e.target.value })}
//                             required
//                             disabled={isProcessing}
//                             className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                               isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                             }`}
//                             placeholder="123 Main Street"
//                           />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               City *
//                             </label>
//                             <input
//                               type="text"
//                               value={formData.city}
//                               onChange={(e) => updateFormData({ city: e.target.value })}
//                               required
//                               disabled={isProcessing}
//                               className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                                 isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                               }`}
//                               placeholder="Lagos"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               State *
//                             </label>
//                             <input
//                               type="text"
//                               value={formData.state}
//                               onChange={(e) => updateFormData({ state: e.target.value })}
//                               required
//                               disabled={isProcessing}
//                               className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                                 isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                               }`}
//                               placeholder="Lagos State"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Postal Code *
//                             </label>
//                             <input
//                               type="text"
//                               value={formData.pincode}
//                               onChange={(e) => updateFormData({ pincode: e.target.value })}
//                               required
//                               disabled={isProcessing}
//                               className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                                 isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                               }`}
//                               placeholder="100001"
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center mt-4">
//                           <input
//                             type="checkbox"
//                             id="saveAsNew"
//                             checked={formData.saveAsNew}
//                             onChange={(e) => updateFormData({ saveAsNew: e.target.checked })}
//                             disabled={isProcessing || !!selectedAddressId}
//                             className={`w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary focus:ring-2 ${
//                               isProcessing || selectedAddressId ? 'opacity-50 cursor-not-allowed' : ''
//                             }`}
//                           />
//                           <label htmlFor="saveAsNew" className={`ml-3 text-sm ${
//                             isProcessing || selectedAddressId ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
//                           }`}>
//                             Save this address to my account
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="bg-white rounded-2xl shadow-sm p-6">
//                     <h2 className="text-xl font-bold text-gray-900 mb-6">
//                       {orderType === 'delivery' ? 'Delivery Instructions' : 'Pickup Information'}
//                     </h2>
                    
//                     {orderType === 'delivery' ? (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Special Instructions (Optional)
//                         </label>
//                         <textarea
//                           value={formData.deliveryInstructions}
//                           onChange={(e) => updateFormData({ deliveryInstructions: e.target.value })}
//                           disabled={isProcessing}
//                           rows={3}
//                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                           }`}
//                           placeholder="Leave at the gate, call when you arrive, etc."
//                         />
//                       </div>
//                     ) : (
//                       <div>
//                         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
//                           <div className="flex items-center">
//                             <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                             </svg>
//                             <div>
//                               <p className="font-medium text-gray-900">Pickup Location</p>
//                               <p className="text-sm text-gray-600">Pepe's Café & Brunch, 123 Food Street, Lagos</p>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Preferred Pickup Time *
//                         </label>
//                         <select
//                           value={formData.pickupTime}
//                           onChange={(e) => updateFormData({ pickupTime: e.target.value })}
//                           required
//                           disabled={isProcessing}
//                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
//                           }`}
//                         >
//                           <option value="">Select pickup time</option>
//                           <option value="asap">ASAP (15-20 minutes)</option>
//                           <option value="30min">30 minutes from now</option>
//                           <option value="1hour">1 hour from now</option>
//                           <option value="2hours">2 hours from now</option>
//                         </select>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="lg:col-span-1">
//                 <OrderSummary 
//                   orderType={orderType}
//                   selectedPayment={selectedPayment}
//                   isProcessing={isProcessing}
//                   onPayment={handlePayment}
//                   onPaymentMethodChange={setSelectedPayment}
//                   items={items}
//                   total={total}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   )
// }










































// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { useRouter } from 'next/navigation'
// // import Header from '../../components/layout/Header'
// // import Footer from '../../components/layout/Footer'
// // import CheckoutForm from '../../components/checkout/CheckoutForm'
// // import OrderSummary from '../../components/checkout/OrderSummary'
// // import PaystackLoader from '../../components/checkout/PaystackLoader'
// // import toast from 'react-hot-toast'
// // import { useCart } from '../../lib/hooks/useCart'
// // import { orderService } from '../../lib/services/api'
// // import { useAuth } from '../../lib/context/authContext'

// // export default function CheckoutPage() {
// //   const router = useRouter()
// //   const { user, isLoading: authLoading, checkAuth } = useAuth()
// //   const { items, total, clearCart } = useCart()
// //   const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
// //   const [selectedPayment, setSelectedPayment] = useState<'paystack' | 'transfer'>('paystack')
// //   const [isProcessing, setIsProcessing] = useState(false)
// //   const [addresses, setAddresses] = useState<any[]>([])
// //   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
// //   const [loadingAddresses, setLoadingAddresses] = useState(true)
// //   const [userInfo, setUserInfo] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     phone: '',
// //   })
// //   const [formData, setFormData] = useState({
// //     address_line: '',
// //     city: '',
// //     state: '',
// //     pincode: '',
// //     country: 'Nigeria',
// //     mobile: '',
// //     saveAsNew: true,
// //     deliveryInstructions: '',
// //     pickupTime: '',
// //   })

// //   // Check authentication on mount
// //   useEffect(() => {
// //     const verifyAuth = async () => {
// //       const isAuthenticated = await checkAuth()
// //       if (!isAuthenticated) {
// //         toast.error('Please sign in to proceed to checkout')
// //         router.push('/login?callbackUrl=/checkout')
// //       }
// //     }
    
// //     verifyAuth()
// //   }, [checkAuth, router])

// //   // Load user info and addresses when authenticated
// //   useEffect(() => {
// //     if (user) {
// //       loadUserData()
// //       loadUserAddresses()
// //     }
// //   }, [user])

// //   const loadUserData = () => {
// //     if (user) {
// //       setUserInfo({
// //         firstName: user.name?.split(' ')[0] || '',
// //         lastName: user.name?.split(' ').slice(1).join(' ') || '',
// //         email: user.email || '',
// //         phone: user.mobile?.toString() || '',
// //       })
      
// //       setFormData(prev => ({
// //         ...prev,
// //         mobile: user.mobile?.toString() || '',
// //       }))
// //     }
// //   }

// //   const loadUserAddresses = async () => {
// //     try {
// //       setLoadingAddresses(true)
// //       const token = localStorage.getItem('token')
// //       if (!token) throw new Error('No authentication token found')

// //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addresses`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       })
      
// //       if (!response.ok) throw new Error('Failed to load addresses')

// //       const data = await response.json()
// //       if (data.success && data.data.length > 0) {
// //         setAddresses(data.data)
// //         const defaultAddress = data.data.find((addr: any) => addr.status)
// //         if (defaultAddress) {
// //           setSelectedAddressId(defaultAddress._id)
// //           setFormData(prev => ({
// //             ...prev,
// //             address_line: defaultAddress.address_line,
// //             city: defaultAddress.city,
// //             state: defaultAddress.state,
// //             pincode: defaultAddress.pincode,
// //             country: defaultAddress.country,
// //             mobile: defaultAddress.mobile?.toString() || prev.mobile,
// //           }))
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error loading addresses:', error)
// //       toast.error('Failed to load addresses')
// //     } finally {
// //       setLoadingAddresses(false)
// //     }
// //   }

// //   const saveAddress = async () => {
// //     try {
// //       if (orderType === 'delivery') {
// //         if (!formData.address_line || !formData.city || !formData.state || !formData.pincode) {
// //           toast.error('Please fill in all required address fields')
// //           return null
// //         }
// //       }

// //       let addressId = selectedAddressId

// //       if (formData.saveAsNew || !selectedAddressId) {
// //         const token = localStorage.getItem('token')
// //         if (!token) throw new Error('Authentication required')

// //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addresses`, {
// //           method: 'POST',
// //           headers: { 
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${token}`
// //           },
// //           body: JSON.stringify({
// //             address_line: formData.address_line,
// //             city: formData.city,
// //             state: formData.state,
// //             pincode: formData.pincode,
// //             country: formData.country,
// //             mobile: formData.mobile || userInfo.phone,
// //           })
// //         })

// //         const data = await response.json()
// //         if (data.success) {
// //           addressId = data.data._id
// //           toast.success('Address saved successfully')
// //           loadUserAddresses()
// //         } else {
// //           toast.error(data.message || 'Failed to save address')
// //           return null
// //         }
// //       }

// //       return addressId
// //     } catch (error) {
// //       console.error('Error saving address:', error)
// //       toast.error('Failed to save address')
// //       return null
// //     }
// //   }

// //   const handlePayment = async () => {
// //     if (!user) {
// //       toast.error('Please sign in to proceed to payment')
// //       router.push('/login?callbackUrl=/checkout')
// //       return
// //     }

// //     if (items.length === 0) {
// //       toast.error('Your cart is empty')
// //       return
// //     }

// //     if (!userInfo.firstName || !userInfo.email || !userInfo.phone) {
// //       toast.error('Please fill in all required personal information')
// //       return
// //     }

// //     setIsProcessing(true)

// //     try {
// //       let addressId = selectedAddressId

// //       if (orderType === 'delivery') {
// //         addressId = await saveAddress()
// //         if (!addressId) {
// //           setIsProcessing(false)
// //           return
// //         }
// //       } else {
// //         addressId = 'pickup'
// //       }

// //       const token = localStorage.getItem('token')
// //       if (!token) throw new Error('Authentication required')

// //       const orderData = {
// //         delivery_address: addressId,
// //         payment_method: selectedPayment === 'paystack' ? 'card' : 'transfer',
// //         notes: formData.deliveryInstructions || '',
// //         pickup_time: orderType === 'pickup' ? formData.pickupTime : undefined,
// //       }

// //       const orderResponse = await orderService.createOrder(orderData)
      
// //       if (!orderResponse.success) {
// //         throw new Error(orderResponse.message || 'Failed to create order')
// //       }

// //       const order = orderResponse.data

// //       if (selectedPayment === 'paystack') {
// //         await handlePaystackPayment(order)
// //       } else {
// //         router.push(`/checkout/transfer?order=${order.orderId}`)
// //       }

// //     } catch (error: any) {
// //       console.error('Checkout error:', error)
// //       toast.error(error.message || 'Checkout failed. Please try again.')
// //       setIsProcessing(false)
// //     }
// //   }

// //   const handlePaystackPayment = async (order: any) => {
// //     const deliveryFee = orderType === 'pickup' ? 0 : total > 50000 ? 0 : 5000
// //     const tax = total * 0.075
// //     const grandTotal = total + deliveryFee + tax

// //     return new Promise((resolve, reject) => {
// //       if (typeof window === 'undefined' || !(window as any).PaystackPop) {
// //         toast.error('Payment system not ready. Please refresh the page.')
// //         reject(new Error('Payment gateway not loaded'))
// //         return
// //       }

// //       const handler = (window as any).PaystackPop.setup({
// //         key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
// //         email: userInfo.email,
// //         amount: Math.round(grandTotal * 100),
// //         currency: 'NGN',
// //         ref: order.orderId,
// //         metadata: {
// //           customer_name: `${userInfo.firstName} ${userInfo.lastName}`,
// //           customer_phone: userInfo.phone,
// //           order_type: orderType,
// //         },
// //         callback: async (response: any) => {
// //           try {
// //             const verifyResponse = await orderService.verifyPayment(response.reference)
            
// //             if (verifyResponse.success) {
// //               clearCart()
// //               toast.success('Payment successful!')
// //               router.push(`/checkout/success?order=${order.orderId}`)
// //               resolve(true)
// //             } else {
// //               toast.error('Payment verification failed. Please contact support.')
// //               reject(new Error('Payment verification failed'))
// //             }
// //           } catch (error) {
// //             console.error('Payment verification error:', error)
// //             toast.error('Payment verification error. Please contact support.')
// //             reject(error)
// //           }
// //         },
// //         onClose: () => {
// //           toast.error('Payment was cancelled')
// //           setIsProcessing(false)
// //           resolve(false)
// //         }
// //       })

// //       handler.openIframe()
// //     })
// //   }

// //   const updateUserInfo = (data: Partial<typeof userInfo>) => {
// //     setUserInfo(prev => ({ ...prev, ...data }))
// //   }

// //   const updateFormData = (data: Partial<typeof formData>) => {
// //     setFormData(prev => ({ ...prev, ...data }))
// //   }

// //   const handleAddressSelect = (addressId: string) => {
// //     setSelectedAddressId(addressId)
// //     const selectedAddress = addresses.find(addr => addr._id === addressId)
// //     if (selectedAddress) {
// //       setFormData(prev => ({
// //         ...prev,
// //         address_line: selectedAddress.address_line,
// //         city: selectedAddress.city,
// //         state: selectedAddress.state,
// //         pincode: selectedAddress.pincode,
// //         country: selectedAddress.country,
// //         mobile: selectedAddress.mobile?.toString() || prev.mobile,
// //         saveAsNew: false,
// //       }))
// //     }
// //   }

// //   if (authLoading) {
// //     return (
// //       <div className="min-h-screen flex flex-col">
// //         <Header />
// //         <main className="flex-grow flex items-center justify-center">
// //           <div className="text-center">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pepe-primary mx-auto"></div>
// //             <p className="mt-4 text-gray-600">Checking authentication...</p>
// //           </div>
// //         </main>
// //         <Footer />
// //       </div>
// //     )
// //   }

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen flex flex-col">
// //         <Header />
// //         <main className="flex-grow py-12">
// //           <div className="container mx-auto px-4 text-center">
// //             <div className="max-w-md mx-auto">
// //               <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
// //                 <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// //                 </svg>
// //               </div>
// //               <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
// //               <p className="text-gray-600 mb-8">
// //                 You need to sign in to proceed to checkout and make payments.
// //               </p>
// //               <button
// //                 onClick={() => router.push('/login?callbackUrl=/checkout')}
// //                 className="w-full py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
// //               >
// //                 Sign In to Continue
// //               </button>
// //               <p className="mt-4 text-sm text-gray-500">
// //                 Don't have an account?{' '}
// //                 <button
// //                   onClick={() => router.push('/register')}
// //                   className="text-pepe-primary hover:underline"
// //                 >
// //                   Sign up here
// //                 </button>
// //               </p>
// //             </div>
// //           </div>
// //         </main>
// //         <Footer />
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-50">
// //       <PaystackLoader />
// //       <Header />
      
// //       <main className="flex-grow py-8">
// //         <div className="container mx-auto px-4">
// //           <div className="mb-8">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
// //                 <p className="text-gray-600">Complete your order securely</p>
// //               </div>
// //               <div className="text-sm text-gray-500">
// //                 Signed in as <span className="font-medium text-gray-900">{userInfo.email}</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="max-w-3xl mx-auto mb-8">
// //             <div className="flex border border-gray-300 rounded-xl overflow-hidden">
// //               <button
// //                 onClick={() => setOrderType('delivery')}
// //                 disabled={isProcessing}
// //                 className={`flex-1 py-4 text-center font-medium transition-colors ${
// //                   orderType === 'delivery' 
// //                     ? 'bg-pepe-primary text-white' 
// //                     : 'bg-white text-gray-700 hover:bg-gray-50'
// //                 } disabled:opacity-50`}
// //               >
// //                 🚚 Delivery
// //               </button>
// //               <button
// //                 onClick={() => setOrderType('pickup')}
// //                 disabled={isProcessing}
// //                 className={`flex-1 py-4 text-center font-medium transition-colors ${
// //                   orderType === 'pickup' 
// //                     ? 'bg-pepe-primary text-white' 
// //                     : 'bg-white text-gray-700 hover:bg-gray-50'
// //                 } disabled:opacity-50`}
// //               >
// //                 🏪 Pickup
// //               </button>
// //             </div>
// //           </div>

// //           <div className="max-w-6xl mx-auto">
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //               <div className="lg:col-span-2">
// //                 <div className="space-y-8">
// //                   <div className="bg-white rounded-2xl shadow-sm p-6">
// //                     <h2 className="text-xl font-bold text-gray-900 mb-6">Your Information</h2>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           First Name *
// //                         </label>
// //                         <input
// //                           type="text"
// //                           value={userInfo.firstName}
// //                           onChange={(e) => updateUserInfo({ firstName: e.target.value })}
// //                           required
// //                           disabled={isProcessing}
// //                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                           }`}
// //                           placeholder="John"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           Last Name *
// //                         </label>
// //                         <input
// //                           type="text"
// //                           value={userInfo.lastName}
// //                           onChange={(e) => updateUserInfo({ lastName: e.target.value })}
// //                           required
// //                           disabled={isProcessing}
// //                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                           }`}
// //                           placeholder="Doe"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           Email *
// //                         </label>
// //                         <input
// //                           type="email"
// //                           value={userInfo.email}
// //                           onChange={(e) => updateUserInfo({ email: e.target.value })}
// //                           required
// //                           disabled={isProcessing}
// //                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                           }`}
// //                           placeholder="john@example.com"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           Phone Number *
// //                         </label>
// //                         <input
// //                           type="tel"
// //                           value={userInfo.phone}
// //                           onChange={(e) => updateUserInfo({ phone: e.target.value })}
// //                           required
// //                           disabled={isProcessing}
// //                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                           }`}
// //                           placeholder="+234 800 000 0000"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {orderType === 'delivery' && (
// //                     <div className="bg-white rounded-2xl shadow-sm p-6">
// //                       <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                      
// //                       {loadingAddresses ? (
// //                         <div className="text-center py-4">
// //                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pepe-primary mx-auto"></div>
// //                           <p className="mt-2 text-sm text-gray-600">Loading addresses...</p>
// //                         </div>
// //                       ) : addresses.length > 0 ? (
// //                         <div className="mb-6">
// //                           <h3 className="font-medium text-gray-700 mb-3">Select a saved address</h3>
// //                           <div className="space-y-3">
// //                             {addresses.map((address) => (
// //                               <div
// //                                 key={address._id}
// //                                 className={`p-4 border rounded-lg cursor-pointer transition-all ${
// //                                   selectedAddressId === address._id
// //                                     ? 'border-pepe-primary bg-pepe-primary/5'
// //                                     : 'border-gray-200 hover:border-gray-300'
// //                                 }`}
// //                                 onClick={() => handleAddressSelect(address._id)}
// //                               >
// //                                 <div className="flex items-start">
// //                                   <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-1 ${
// //                                     selectedAddressId === address._id
// //                                       ? 'border-pepe-primary bg-pepe-primary'
// //                                       : 'border-gray-300'
// //                                   }`}>
// //                                     {selectedAddressId === address._id && (
// //                                       <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
// //                                     )}
// //                                   </div>
// //                                   <div className="flex-grow">
// //                                     <div className="flex justify-between">
// //                                       <p className="font-medium text-gray-900">
// //                                         {address.address_line}, {address.city}
// //                                       </p>
// //                                       {address.status && (
// //                                         <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
// //                                           Default
// //                                         </span>
// //                                       )}
// //                                     </div>
// //                                     <p className="text-sm text-gray-600 mt-1">
// //                                       {address.city}, {address.state} {address.pincode}
// //                                     </p>
// //                                     <p className="text-sm text-gray-600">{address.country}</p>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             ))}
// //                           </div>
// //                           <div className="mt-4 text-center">
// //                             <button
// //                               onClick={() => {
// //                                 setSelectedAddressId(null)
// //                                 setFormData(prev => ({
// //                                   ...prev,
// //                                   address_line: '',
// //                                   city: '',
// //                                   state: '',
// //                                   pincode: '',
// //                                   country: 'Nigeria',
// //                                   saveAsNew: true,
// //                                 }))
// //                               }}
// //                               className="text-pepe-primary hover:text-pepe-dark text-sm font-medium"
// //                             >
// //                               + Add new address
// //                             </button>
// //                           </div>
// //                         </div>
// //                       ) : (
// //                         <div className="text-center py-6">
// //                           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
// //                             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
// //                             </svg>
// //                           </div>
// //                           <p className="text-gray-600 mb-4">No saved addresses found</p>
// //                         </div>
// //                       )}

// //                       <div className="space-y-4">
// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-700 mb-2">
// //                             Street Address *
// //                           </label>
// //                           <input
// //                             type="text"
// //                             value={formData.address_line}
// //                             onChange={(e) => updateFormData({ address_line: e.target.value })}
// //                             required
// //                             disabled={isProcessing}
// //                             className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                               isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                             }`}
// //                             placeholder="123 Main Street"
// //                           />
// //                         </div>

// //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                           <div>
// //                             <label className="block text-sm font-medium text-gray-700 mb-2">
// //                               City *
// //                             </label>
// //                             <input
// //                               type="text"
// //                               value={formData.city}
// //                               onChange={(e) => updateFormData({ city: e.target.value })}
// //                               required
// //                               disabled={isProcessing}
// //                               className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                                 isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                               }`}
// //                               placeholder="Lagos"
// //                             />
// //                           </div>
// //                           <div>
// //                             <label className="block text-sm font-medium text-gray-700 mb-2">
// //                               State *
// //                             </label>
// //                             <input
// //                               type="text"
// //                               value={formData.state}
// //                               onChange={(e) => updateFormData({ state: e.target.value })}
// //                               required
// //                               disabled={isProcessing}
// //                               className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                                 isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                               }`}
// //                               placeholder="Lagos State"
// //                             />
// //                           </div>
// //                           <div>
// //                             <label className="block text-sm font-medium text-gray-700 mb-2">
// //                               Postal Code *
// //                             </label>
// //                             <input
// //                               type="text"
// //                               value={formData.pincode}
// //                               onChange={(e) => updateFormData({ pincode: e.target.value })}
// //                               required
// //                               disabled={isProcessing}
// //                               className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                                 isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                               }`}
// //                               placeholder="100001"
// //                             />
// //                           </div>
// //                         </div>

// //                         <div className="flex items-center mt-4">
// //                           <input
// //                             type="checkbox"
// //                             id="saveAsNew"
// //                             checked={formData.saveAsNew}
// //                             onChange={(e) => updateFormData({ saveAsNew: e.target.checked })}
// //                             disabled={isProcessing || !!selectedAddressId}
// //                             className={`w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary focus:ring-2 ${
// //                               isProcessing || selectedAddressId ? 'opacity-50 cursor-not-allowed' : ''
// //                             }`}
// //                           />
// //                           <label htmlFor="saveAsNew" className={`ml-3 text-sm ${
// //                             isProcessing || selectedAddressId ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
// //                           }`}>
// //                             Save this address to my account
// //                           </label>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}

// //                   <div className="bg-white rounded-2xl shadow-sm p-6">
// //                     <h2 className="text-xl font-bold text-gray-900 mb-6">
// //                       {orderType === 'delivery' ? 'Delivery Instructions' : 'Pickup Information'}
// //                     </h2>
                    
// //                     {orderType === 'delivery' ? (
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           Special Instructions (Optional)
// //                         </label>
// //                         <textarea
// //                           value={formData.deliveryInstructions}
// //                           onChange={(e) => updateFormData({ deliveryInstructions: e.target.value })}
// //                           disabled={isProcessing}
// //                           rows={3}
// //                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none ${
// //                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                           }`}
// //                           placeholder="Leave at the gate, call when you arrive, etc."
// //                         />
// //                       </div>
// //                     ) : (
// //                       <div>
// //                         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
// //                           <div className="flex items-center">
// //                             <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
// //                             </svg>
// //                             <div>
// //                               <p className="font-medium text-gray-900">Pickup Location</p>
// //                               <p className="text-sm text-gray-600">Pepe's Café & Brunch, 123 Food Street, Lagos</p>
// //                             </div>
// //                           </div>
// //                         </div>
                        
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           Preferred Pickup Time *
// //                         </label>
// //                         <select
// //                           value={formData.pickupTime}
// //                           onChange={(e) => updateFormData({ pickupTime: e.target.value })}
// //                           required
// //                           disabled={isProcessing}
// //                           className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
// //                             isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
// //                           }`}
// //                         >
// //                           <option value="">Select pickup time</option>
// //                           <option value="asap">ASAP (15-20 minutes)</option>
// //                           <option value="30min">30 minutes from now</option>
// //                           <option value="1hour">1 hour from now</option>
// //                           <option value="2hours">2 hours from now</option>
// //                         </select>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="lg:col-span-1">
// //                 <OrderSummary 
// //                   orderType={orderType}
// //                   selectedPayment={selectedPayment}
// //                   isProcessing={isProcessing}
// //                   onPayment={handlePayment}
// //                   onPaymentMethodChange={setSelectedPayment}
// //                   items={items}
// //                   total={total}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
      
// //       <Footer />
// //     </div>
// //   )
// // }