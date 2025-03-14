## Nguyên tắc luồng dữ liệu một chiều trong Vue

- Vue được thiết kế với luồng dữ liệu 1 chiều từ parent -> child
- Khi child muốn thay đổi dữ liệu của parent, thì nó phải emit event lên parent

### v-model trong component Vue

Với input html thông thường, v-model="text" thực chất là viết tắt của

```html
<input :value="text" @input="text = $event.target.value" />
```

### Sự khác biệt quan trọng giữa actions và getters trong các store:

#### Getters (getPosts)

- Mục đích: Đọc và trả về dữ liệu từ state
- Tính chất: Giống như computed properties
- Đồng bộ: Luôn là đồng bộ (synchronous), không thể chứa các thao tác bất đồng bộ
- Ví dụ: getPosts chỉ đơn thuần lấy và hiển thị dữ liệu đã có trong state

#### Actions (fetchPosts)

- Mục đích: Thực hiện các thao tác có thể thay đổi state, đặc biệt là các thao tác bất đồng bộ như gọi API
- Tính chất: Là hàm có thể thực hiện các thao tác phức tạp
- Bất đồng bộ: Có thể chứa các thao tác bất đồng bộ (async/await, promises)
- Ví dụ: fetchPosts gọi API và cập nhật state với dữ liệu mới

#### Tại sao cần cả hai?

1. Nguồn dữ liệu khác nhau:

- getPosts chỉ truy xuất dữ liệu đã có trong state
- fetchPosts lấy dữ liệu từ nguồn bên ngoài (backend API)

2. Luồng dữ liệu:
   API → fetchPosts (action) → state → getPosts (getter) → component
3. Khởi tạo dữ liệu:

- Khi ứng dụng khởi động, state rỗng
- Cần fetchPosts để lấy dữ liệu ban đầu và cập nhật state
- Sau đó getPosts sẽ có dữ liệu để trả về

4. Cập nhật dữ liệu:

- Mỗi khi cần refresh dữ liệu từ server, bạn gọi fetchPosts
- Còn components luôn dùng getPosts để hiển thị dữ liệu
- Đây là mô hình phổ biến trong kiến trúc Flux/Redux/Vuex/Pinia: tách biệt việc lấy dữ liệu (actions) và việc đọc dữ liệu (getters).

### Khi nào dùng ref và khi nào dùng computed?

#### Dùng ref khi:

- Bạn cần một biến reactive có thể thay đổi trực tiếp
- Giá trị không phụ thuộc vào các giá trị reactive khác
- Ví dụ: form inputs, toggle states, local component state

#### Dùng computed khi:

- Giá trị phụ thuộc vào reactive states khác
- Cần tính toán hoặc biến đổi dữ liệu
- Muốn tận dụng caching để tối ưu hiệu suất
- Làm việc với dữ liệu từ store
