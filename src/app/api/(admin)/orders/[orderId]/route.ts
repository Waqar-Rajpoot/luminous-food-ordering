// import dbConnect from '@/lib/dbConnect'; 
// import OrderModel from '@/models/Order.model';


// type OrderStatus = "pending" | "paid" | "canceled";
// type ShippingProgress = 'processing' | 'shipped' | 'delivered' | 'canceled';


// export async function PATCH(request: Request, context: { params: { orderId: string } }) {
//     try {
//         const orderId = await context.params.orderId;
        
//         const body = await request.json();
//         const { orderStatus, shippingProgress } = body;
        
//         await dbConnect();
        
//         if (!orderId) {
//             return new Response(JSON.stringify({ error: "Missing Order ID in URL parameter." }), { status: 400 });
//         }
        
//         if (!orderStatus && !shippingProgress) {
//             return new Response(JSON.stringify({ error: "No update fields provided. Requires 'orderStatus' or 'shippingProgress'." }), { status: 400 });
//         }
        
//         const updates: { [key: string]: any } = {};

//         if (orderStatus) {
//             const validStatuses: OrderStatus[] = ["pending", "paid", "canceled"];
//             if (!validStatuses.includes(orderStatus as OrderStatus)) {
//                 return new Response(JSON.stringify({ error: `Invalid orderStatus: ${orderStatus}` }), { status: 400 });
//             }
//             updates.orderStatus = orderStatus;
//         }

//         if (shippingProgress) {
//             const validProgress: ShippingProgress[] = ["processing", "shipped", "delivered", "canceled"];
//             if (!validProgress.includes(shippingProgress as ShippingProgress)) {
//                 return new Response(JSON.stringify({ error: `Invalid shippingProgress: ${shippingProgress}` }), { status: 400 });
//             }
//             updates.shippingProgress = shippingProgress;
//         }

//         const updatedOrder = await OrderModel.findByIdAndUpdate(
//             orderId, 
//             { $set: updates },
//             { new: true }      
//         );

//         if (!updatedOrder) {
//             return new Response(JSON.stringify({ error: `Order with ID ${orderId} not found.` }), { status: 404 });
//         }

//         return new Response(JSON.stringify(updatedOrder), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });

//     } catch (error: any) {
//         console.error("API Error during order update:", error.message);
//         return new Response(JSON.stringify({ error: "Server error during update." }), { status: 500 });
//     }
// }

// export async function DELETE(request: Request, context: { params: { orderId: string } }) {
//     try {
//         const orderId = await context.params.orderId;
        
//         if (!orderId) {
//             return new Response(JSON.stringify({ error: "Missing Order ID in URL parameter." }), { status: 400 });
//         }

//         await dbConnect();
        
//         const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

//         if (!deletedOrder) {
//             return new Response(JSON.stringify({ error: `Order with ID ${orderId} not found for deletion.` }), { status: 404 });
//         }

//         return new Response(JSON.stringify({ success: true, message: "Order deleted successfully." }), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });

//     } catch (error: any) {
//         console.error("API Error during order deletion:", error.message);
//         return new Response(JSON.stringify({ error: "Server error during deletion." }), { status: 500 });
//     }
// }






import dbConnect from '@/lib/dbConnect'; 
import OrderModel from '@/models/Order.model';

type OrderStatus = "pending" | "paid" | "canceled";
type ShippingProgress = 'processing' | 'shipped' | 'delivered' | 'canceled';

// Define the interface for Route Parameters in Next.js 15
interface RouteContext {
    params: Promise<{ orderId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
    try {
        // Correctly awaiting the params promise
        const { orderId } = await context.params;
        
        const body = await request.json();
        const { orderStatus, shippingProgress } = body;
        
        await dbConnect();
        
        if (!orderId) {
            return new Response(JSON.stringify({ error: "Missing Order ID in URL parameter." }), { status: 400 });
        }
        
        if (!orderStatus && !shippingProgress) {
            return new Response(JSON.stringify({ error: "No update fields provided. Requires 'orderStatus' or 'shippingProgress'." }), { status: 400 });
        }
        
        const updates: { [key: string]: any } = {};

        if (orderStatus) {
            const validStatuses: OrderStatus[] = ["pending", "paid", "canceled"];
            if (!validStatuses.includes(orderStatus as OrderStatus)) {
                return new Response(JSON.stringify({ error: `Invalid orderStatus: ${orderStatus}` }), { status: 400 });
            }
            updates.orderStatus = orderStatus;
        }

        if (shippingProgress) {
            const validProgress: ShippingProgress[] = ["processing", "shipped", "delivered", "canceled"];
            if (!validProgress.includes(shippingProgress as ShippingProgress)) {
                return new Response(JSON.stringify({ error: `Invalid shippingProgress: ${shippingProgress}` }), { status: 400 });
            }
            updates.shippingProgress = shippingProgress;
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId, 
            { $set: updates },
            { new: true }      
        );

        if (!updatedOrder) {
            return new Response(JSON.stringify({ error: `Order with ID ${orderId} not found.` }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedOrder), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("API Error during order update:", error.message);
        return new Response(JSON.stringify({ error: "Server error during update." }), { status: 500 });
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    try {
        // Correctly awaiting the params promise
        const { orderId } = await context.params;
        
        if (!orderId) {
            return new Response(JSON.stringify({ error: "Missing Order ID in URL parameter." }), { status: 400 });
        }

        await dbConnect();
        
        const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return new Response(JSON.stringify({ error: `Order with ID ${orderId} not found for deletion.` }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: "Order deleted successfully." }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("API Error during order deletion:", error.message);
        return new Response(JSON.stringify({ error: "Server error during deletion." }), { status: 500 });
    }
}