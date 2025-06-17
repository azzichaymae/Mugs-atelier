import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("user_id");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const deleteOrder = async (orderId, orderStatus) => {
    Swal.fire({
      text: "Are you sure you want to delete this order ?",
      icon: "warning",
      width: "300px",
      padding: "0.8rem",
      showCancelButton: true,

      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-md  btn-success",
        cancelButton: "btn btn-md btn-secondary",
      },
    }).then(async(result) => {
      if (result.isConfirmed) {
          try {
        const response = await fetch(
          `http://127.0.0.1:8000/orders/${orderId}/delete`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
           toast.success("Order deleted successfully.", {
                 position: "top-center",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
                });
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.order_id !== orderId)
          );
        } else {
          alert("Failed to delete the order.");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
      }
    });

    // if (window.confirm("Are you sure you want to delete this order?")) {
    //   try {
    //     const response = await fetch(
    //       `http://127.0.0.1:8000/orders/${orderId}/delete`,
    //       {
    //         method: "DELETE",
    //       }
    //     );

    //     if (response.ok) {
    //        toast.success("Order deleted successfully.", {
    //              position: "top-center",
    //           autoClose: 1500,
    //           hideProgressBar: true,
    //           closeOnClick: true,
    //           pauseOnHover: false,
    //             });
    //       setOrders((prevOrders) =>
    //         prevOrders.filter((order) => order.order_id !== orderId)
    //       );
    //     } else {
    //       alert("Failed to delete the order.");
    //     }
    //   } catch (error) {
    //     console.error("Error deleting order:", error);
    //   }
    // }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/orders/?user_id=${userId}`
        );
        const data = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section
      id="orders-content"
      class=" tab-content max-w-4xl w-full rounded-lg border border-[#c9c5a1] bg-[#f3f0de] p-6"
      aria-label="Order History Section"
    >
      <h2 class="flex items-center text-[#4a4a3a] font-semibold text-lg mb-4 select-none">
        <i class="fa fa-light fa-box mr-2"></i>
        Order History
      </h2>
      <div className="overflow-x-auto">
        <table
          class="w-full border border-[#c9c5a1] rounded-md text-[#7a765a] text-sm"
          role="table"
        >
          <thead>
            <tr class="border-b border-[#c9c5a1]">
              <th class="py-3 px-4 text-left font-normal">Order ID</th>
              <th class="py-3 px-4 text-left font-normal">Date</th>
              <th class="py-3 px-4 text-left font-normal">Status</th>
              <th class="py-3 px-4 text-left font-normal">Items</th>
              <th class="py-3 px-4 text-left font-normal">Total</th>
              <th class="py-3 px-4 text-left font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.order_id} className="border-b border-[#c9c5a1]">
                  <td className="py-3 px-4 font-semibold text-[#3a3a2a]">
                    {order.order_id}
                  </td>
                  <td className="py-3 px-4">{order.created_at}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded px-2 py-[2px] text-xs font-medium ${
                        order.status === "Delivered"
                          ? "text-[#2f7a4f] bg-[#d9f7e1]"
                          : order.status === "Shipped"
                          ? "text-[#2a4f7a] bg-[#d9e6f7]"
                          : order.status === "Packed"
                          ? "text-[#7a4f2a] bg-[#f7e6d9]"
                          : order.status === "Processing"
                          ? "text-[#7a2f4f] bg-[#f7d9e6]"
                          : order.status === "Pending"
                          ? "text-[#7a7a2f] bg-[#f7f7d9]"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{order.items.length}</td>
                  <td className="py-3 px-4 font-semibold text-[#3a3a2a]">
                    ${order.total_price}
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      className="bg-white p-2 rounded-full shadow"
                      onClick={() => openModal(order)}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                    <button
                      className={`bg-white p-2 rounded-full shadow ${
                        order.status !== "Delivered"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => deleteOrder(order.order_id, order.status)}
                      disabled={order.status !== "Delivered"}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-center text-gray-500" colSpan="6">
                  No orders found
                </td>
              </tr>
            )}
            {selectedOrder && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-70   flex justify-center items-center z-50">
                <div className="bg-[#f5f2ed] rounded-lg shadow-md w-full max-w-lg mx-4 p-6">
                  <h2 className="text-xl font-medium text-gray-800 mb-4">
                    Order Details
                  </h2>
                  <div className="space-y-3 border-b border-gray-200 pb-4">
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Order ID:</span>{" "}
                      {selectedOrder.order_id}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {selectedOrder.created_at}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          selectedOrder.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Total:</span> $
                      {selectedOrder.total_price}
                    </p>
                  </div>

                  {/* Display Order Items */}
                  <h3 className="text-lg font-medium text-gray-800 mt-4 mb-3">
                    Items
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center text-gray-700 text-sm py-2 border-b border-gray-100"
                        >
                          <span className="font-medium">
                            {item.product_name}
                          </span>
                          <span>
                            {item.quantity} x ${item.price}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No items in this order.
                      </p>
                    )}
                  </ul>

                  <button
                    className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Orders;
