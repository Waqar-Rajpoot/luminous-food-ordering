// "use client";

// import React from 'react';
// import { usePage } from '@/context/PageContext';
// import { useCart } from '@/context/CartContext';

// import CheckoutPage from '@/components/checkout/CheckoutPage'; 

// export default function AppRouter() {
//   const { currentPage, setCurrentPage } = usePage();
//   const { cart, updateQuantity, removeItemFromCart, getOriginalCartTotal, dispatch } = useCart();

//   const renderCartFlow = () => {
//     switch (currentPage) {
//       case 'checkout':
//         return (
//           <div className="min-h-[80vh]">
//             <CheckoutPage 
//                 cart={cart}
//                 handleUpdateQuantity={(item, quantity) => updateQuantity(item.id, quantity)}
//                 handleRemoveItem={(item) => removeItemFromCart(item.id)}
//                 getOriginalCartTotal={getOriginalCartTotal}
//                 dispatch={dispatch}
//                 setCurrentPage={setCurrentPage}
//             />
//           </div>
//         );
        
//       default:
//         return null; 
//     }
//   };

//   return renderCartFlow();
// }




"use client";

import React from 'react';
import { usePage } from '@/context/PageContext';
import { useCart } from '@/context/CartContext';
import CheckoutPage from '@/components/checkout/CheckoutPage'; 

export default function AppRouter() {
  const { currentPage, setCurrentPage } = usePage();
  const { cart, updateQuantity, removeItemFromCart, getOriginalCartTotal, dispatch } = useCart();

  const renderCartFlow = () => {
    // Check for both 'cart' and 'checkout'
    switch (currentPage) {
      case 'cart':     // Added this case
      case 'checkout': // Both will now render the CheckoutPage
        return (
          <div className="min-h-[80vh] container mx-auto px-4">
            <CheckoutPage 
                cart={cart}
                handleUpdateQuantity={(item, quantity) => updateQuantity(item.id, quantity)}
                handleRemoveItem={(item) => removeItemFromCart(item.id)}
                getOriginalCartTotal={getOriginalCartTotal}
                dispatch={dispatch}
                setCurrentPage={setCurrentPage as any}  // Type assertion to 'any'
            />
          </div>
        );
        
      default:
        // If the page is 'products' or anything else, 
        // return null so ContentManager shows the children instead.
        return null; 
    }
  };

  return renderCartFlow();
}