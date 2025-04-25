const Orders = () => {
     return(
    <div id="orders-content" class=" tab-content bg-beige-200 p-6 rounded-lg  full-width w-full  min-h-screen " >
        <h1 class="text-xl  mb-4 flex items-center">
            <i class="fas fa-box mr-2"></i> Order History
        </h1>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-beige-200">
                <thead>
                    <tr>
                        <th class="py-2 px-4 text-left">Order ID</th>
                        <th class="py-2 px-4 text-left">Date</th>
                        <th class="py-2 px-4 text-left">Status</th>
                        <th class="py-2 px-4 text-left">Items</th>
                        <th class="py-2 px-4 text-left">Total</th>
                        <th class="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                {/* <tbody>
                    <tr class="border-t border-beige-300">
                        <td class="py-2 px-4">ORD-5123</td>
                        <td class="py-2 px-4">15 Mar 2024</td>
                        <td class="py-2 px-4">
                            <span class="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-full">Delivered</span>
                        </td>
                        <td class="py-2 px-4">3</td>
                        <td class="py-2 px-4">$75.99</td>
                        <td class="py-2 px-4 flex space-x-2">
                            <button class="bg-white p-2 rounded-full shadow">
                                <i class="fas fa-search"></i>
                            </button>
                            <button class="bg-white p-2 rounded-full shadow">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                        </td>
                    </tr>
                    <tr class="border-t border-beige-300">
                        <td class="py-2 px-4">ORD-4892</td>
                        <td class="py-2 px-4">28 Feb 2024</td>
                        <td class="py-2 px-4">
                            <span class="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">Shipped</span>
                        </td>
                        <td class="py-2 px-4">1</td>
                        <td class="py-2 px-4">$29.99</td>
                        <td class="py-2 px-4 flex space-x-2">
                            <button class="bg-white p-2 rounded-full shadow">
                                <i class="fas fa-search"></i>
                            </button>
                            <button class="bg-white p-2 rounded-full shadow">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                        </td>
                    </tr>
                    <tr class="border-t border-beige-300">
                        <td class="py-2 px-4">ORD-4581</td>
                        <td class="py-2 px-4">12 Jan 2024</td>
                        <td class="py-2 px-4">
                            <span class="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-full">Delivered</span>
                        </td>
                        <td class="py-2 px-4">2</td>
                        <td class="py-2 px-4">$46.50</td>
                        <td class="py-2 px-4 flex space-x-2">
                            <button class="bg-white p-2 rounded-full shadow">
                                <i class="fas fa-search"></i>
                            </button>
                            <button class="bg-white p-2 rounded-full shadow">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                        </td>
                    </tr>
                </tbody> */}
            </table>
        </div>
    </div>
     )
}
export default Orders;