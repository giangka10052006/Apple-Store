
// 1. KHỞI TẠO BIỂU TƯỢNG (LUCIDE ICONS)

document.addEventListener("DOMContentLoaded", function () {
	// Khởi tạo tất cả icon Lucide có trên trang
	lucide.createIcons();
});


// 2. CHỨC NĂNG THÊM VÀO GIỎ HÀNG (SHOPPING CART)
let cartCount = 0; // Biến đếm số lượng giỏ hàng

function addToCart(productName) {
	// Tăng số lượng sản phẩm
	cartCount++;

	// Cập nhật con số hiển thị trên Header
	const cartBadge = document.getElementById("cartCount");
	cartBadge.innerText = cartCount;

	// Hiệu ứng nảy số giỏ hàng
	cartBadge.style.transform = "scale(1.3)";
	setTimeout(() => {
		cartBadge.style.transform = "scale(1)";
	}, 200);

	// Thông báo cho người dùng
	alert(`Đã thêm "${productName}" vào giỏ hàng thành công!`);
}

// 3. CHỨC NĂNG BỘ LỌC SẢN PHẨM (FILTER TABS)
const filterButtons = document.querySelectorAll(".tab-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		// 1. Đổi trạng thái Active cho nút được nhấn
		filterButtons.forEach((btn) => btn.classList.remove("active"));
		button.classList.add("active");

		// 2. Lấy giá trị bộ lọc (all, iphone16, iphone15)
		const filterValue = button.getAttribute("data-filter");

		// 3. Ẩn/Hiện sản phẩm tương ứng
		productCards.forEach((card) => {
			const cardCategory = card.getAttribute("data-category");

			if (filterValue === "all" || filterValue === cardCategory) {
				card.style.display = "flex"; // Hiện sản phẩm
			} else {
				card.style.display = "none"; // Ẩn sản phẩm
			}
		});
	});
});


// giỏ hàng
// Khai báo dữ liệu giỏ hàng ban đầu
let cartItems = [
    { id: 1, price: 34990000, qty: 1 },
    { id: 2, price: 28990000, qty: 1 }
];

let discountAmount = 0; // Tiền giảm giá

// Khởi tạo Icon
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    calculateTotal();
});

// Hàm định dạng tiền VNĐ (VD: 34990000 -> 34.990.000đ)
function formatVND(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

// Cập nhật số lượng sản phẩm (+/-)
function updateQty(id, change) {
    const item = cartItems.find(p => p.id === id);
    if (!item) return;

    item.qty += change;

    // Nếu giảm số lượng về 0 thì hỏi xóa
    if (item.qty <= 0) {
        removeItem(id);
        return;
    }

    // Cập nhật giao diện số lượng & tổng tiền của sản phẩm đó
    document.getElementById(`qty-${id}`).innerText = item.qty;
    document.getElementById(`total-${id}`).innerText = formatVND(item.price * item.qty);

    calculateTotal();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(id) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        cartItems = cartItems.filter(p => p.id !== id);
        const itemElement = document.getElementById(`item-${id}`);
        if (itemElement) itemElement.remove();

        // Kiểm tra nếu giỏ hàng trống
        if (cartItems.length === 0) {
            document.getElementById("cartItemsContainer").innerHTML = `
                <div style="text-align: center; padding: 40px 0; color: var(--text-gray);">
                    <p style="font-size: 16px; margin-bottom: 10px;">Giỏ hàng của bạn đang trống!</p>
                    <a href="trang-chu.html" class="btn btn-primary" style="display: inline-flex;">Mua sắm ngay</a>
                </div>
            `;
        }

        calculateTotal();
    }
}

// Hàm xóa toàn bộ giỏ hàng
function clearAllCart() {
    if (cartItems.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    if (confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không?")) {
        // Xóa sạch mảng dữ liệu
        cartItems = [];

        // Xóa giao diện danh sách sản phẩm và hiện thông báo giỏ trống
        document.getElementById("cartItemsContainer").innerHTML = `
            <div style="text-align: center; padding: 40px 0; color: var(--text-gray);">
                <p style="font-size: 16px; margin-bottom: 10px;">Giỏ hàng của bạn đang trống!</p>
                <a href="trang-chu.html" class="btn btn-primary" style="display: inline-flex;">Mua sắm ngay</a>
            </div>
        `;

        // Cập nhật lại toàn bộ tổng tiền (về 0)
        calculateTotal();
    }
}

// Tính toán tổng tiền hóa đơn
function calculateTotal() {
    let subTotal = 0;
    let totalItemsCount = 0;

    cartItems.forEach(item => {
        subTotal += item.price * item.qty;
        totalItemsCount += item.qty;
    });

    const finalTotal = Math.max(0, subTotal - discountAmount);

    // Cập nhật lên UI
    document.getElementById("subTotalText").innerText = formatVND(subTotal);
    document.getElementById("discountText").innerText = `-${formatVND(discountAmount)}`;
    document.getElementById("finalPriceText").innerText = formatVND(finalTotal);
    document.getElementById("cartTotalItems").innerText = totalItemsCount;
    document.getElementById("cartCountHeader").innerText = totalItemsCount;
}

// Áp dụng mã giảm giá
function applyCoupon() {
    const code = document.getElementById("couponCode").value.trim().toUpperCase();
    const msg = document.getElementById("couponMsg");

    if (code === "IHUB2026") {
        discountAmount = 2000000; // Giảm 2 triệu
        msg.style.color = "#34D399";
        msg.innerText = "✓ Áp dụng mã IHUB2026 thành công! Giảm 2.000.000đ";
    } else if (code === "") {
        msg.style.color = "#F87171";
        msg.innerText = "Vui lòng nhập mã giảm giá!";
    } else {
        discountAmount = 0;
        msg.style.color = "#F87171";
        msg.innerText = "Mã không hợp lệ hoặc đã hết hạn!";
    }

    calculateTotal();
}

// Xử lý sự kiện đặt hàng
function handleCheckout(e) {
    e.preventDefault();
    if (cartItems.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    alert("🎉 ĐẶT HÀNG THÀNH CÔNG!\nCảm ơn bạn đã mua hàng tại iHub Store. Chúng tôi sẽ liên hệ để xác nhận đơn hàng trong thời gian sớm nhất.");
    window.location.href = "trang-chu.html";
}