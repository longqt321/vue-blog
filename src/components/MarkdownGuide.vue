<script setup>
import { ref } from "vue";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const isVisible = ref(false);
const activeTab = ref("markdown");

const toggleGuide = () => {
  isVisible.value = !isVisible.value;
};

const closeGuide = () => {
  isVisible.value = false;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const markdownSections = [
  {
    title: "📝 Tiêu đề",
    code: `# Tiêu đề cấp 1
## Tiêu đề cấp 2
### Tiêu đề cấp 3`,
    result: `# Tiêu đề cấp 1
## Tiêu đề cấp 2
### Tiêu đề cấp 3`,
  },
  {
    title: "✨ Định dạng văn bản",
    code: `**In đậm** hoặc __In đậm__
*In nghiêng* hoặc _In nghiêng_
***In đậm và nghiêng***
~~Gạch ngang~~`,
    result: `**In đậm** hoặc __In đậm__
*In nghiêng* hoặc _In nghiêng_
***In đậm và nghiêng***
~~Gạch ngang~~`,
  },
  {
    title: "📋 Danh sách",
    code: `### Danh sách có thứ tự
1. Mục đầu tiên
2. Mục thứ hai
3. Mục thứ ba

### Danh sách không có thứ tự
- Mục A
- Mục B
  - Mục con B1
  - Mục con B2
- Mục C`,
    result: `### Danh sách có thứ tự
1. Mục đầu tiên
2. Mục thứ hai
3. Mục thứ ba

### Danh sách không có thứ tự
- Mục A
- Mục B
  - Mục con B1
  - Mục con B2
- Mục C`,
  },
  {
    title: "🔗 Liên kết và hình ảnh",
    code: `[Liên kết đến Google](https://google.com)
![Mô tả hình ảnh](https://via.placeholder.com/150)`,
    result: `[Liên kết đến Google](https://google.com)
![Mô tả hình ảnh](https://via.placeholder.com/150)`,
  },
  {
    title: "💻 Code",
    code: `\`Code inline\`

\`\`\`javascript
// Code block
function hello() {
    console.log("Hello World!");
}
\`\`\``,
    result: `\`Code inline\`

\`\`\`javascript
// Code block
function hello() {
    console.log("Hello World!");
}
\`\`\``,
  },
  {
    title: "📊 Bảng",
    code: `| Cột 1 | Cột 2 | Cột 3 |
|-------|-------|-------|
| A     | B     | C     |
| 1     | 2     | 3     |`,
    result: `| Cột 1 | Cột 2 | Cột 3 |
|-------|-------|-------|
| A     | B     | C     |
| 1     | 2     | 3     |`,
  },
  {
    title: "💬 Trích dẫn",
    code: `> Đây là một đoạn trích dẫn
> Có thể có nhiều dòng`,
    result: `> Đây là một đoạn trích dẫn
> Có thể có nhiều dòng`,
  },
];

const mathSections = [
  {
    title: "📐 Công thức inline",
    code: `Đây là công thức inline: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$

Hoặc: $E = mc^2$`,
    result: `Đây là công thức inline: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$

Hoặc: $E = mc^2$`,
  },
  {
    title: "📊 Công thức block",
    code: `$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$`,
    result: `$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$`,
  },
  {
    title: "🔢 Phân số và căn thức",
    code: `$\\frac{a}{b}$ hoặc $\\dfrac{a}{b}$ (lớn hơn)

$\\sqrt{x}$ hoặc $\\sqrt[n]{x}$`,
    result: `$\\frac{a}{b}$ hoặc $\\dfrac{a}{b}$ (lớn hơn)

$\\sqrt{x}$ hoặc $\\sqrt[n]{x}$`,
  },
  {
    title: "⬆️ Lũy thừa và chỉ số",
    code: `$x^2$, $x_1$, $x^{2n+1}$, $x_{i,j}$`,
    result: `$x^2$, $x_1$, $x^{2n+1}$, $x_{i,j}$`,
  },
  {
    title: "∫ Tích phân",
    code: `$\\int$, $\\iint$, $\\iiint$

$\\int_a^b f(x)dx$`,
    result: `$\\int$, $\\iint$, $\\iiint$

$\\int_a^b f(x)dx$`,
  },
  {
    title: "Σ Tổng và tích",
    code: `$\\sum_{i=1}^n$, $\\prod_{i=1}^n$

$\\lim_{x \\to \\infty}$, $\\lim_{n \\to 0}$`,
    result: `$\\sum_{i=1}^n$, $\\prod_{i=1}^n$

$\\lim_{x \\to \\infty}$, $\\lim_{n \\to 0}$`,
  },
  {
    title: "🔢 Ma trận",
    code: `$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

$$
\\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{bmatrix}
$$`,
    result: `$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

$$
\\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{bmatrix}
$$`,
  },
  {
    title: "📐 Hệ phương trình",
    code: `$$
\\begin{cases}
x + y = 5 \\\\
2x - y = 1
\\end{cases}
$$`,
    result: `$$
\\begin{cases}
x + y = 5 \\\\
2x - y = 1
\\end{cases}
$$`,
  },
  {
    title: "🔤 Ký hiệu Hy Lạp",
    code: `$\\alpha$, $\\beta$, $\\gamma$, $\\delta$, $\\epsilon$

$\\pi$, $\\sigma$, $\\theta$, $\\phi$, $\\psi$, $\\omega$`,
    result: `$\\alpha$, $\\beta$, $\\gamma$, $\\delta$, $\\epsilon$

$\\pi$, $\\sigma$, $\\theta$, $\\phi$, $\\psi$, $\\omega$`,
  },
  {
    title: "⚡ Toán tử",
    code: `$\\times$, $\\div$, $\\pm$, $\\mp$

$\\leq$, $\\geq$, $\\neq$, $\\approx$

$\\in$, $\\notin$, $\\subset$, $\\supset$

$\\cup$, $\\cap$, $\\emptyset$, $\\infty$`,
    result: `$\\times$, $\\div$, $\\pm$, $\\mp$

$\\leq$, $\\geq$, $\\neq$, $\\approx$

$\\in$, $\\notin$, $\\subset$, $\\supset$

$\\cup$, $\\cap$, $\\emptyset$, $\\infty$`,
  },
  {
    title: "📊 Hàm đặc biệt",
    code: `$\\sin(x)$, $\\cos(x)$, $\\tan(x)$

$\\log(x)$, $\\ln(x)$, $\\exp(x)$`,
    result: `$\\sin(x)$, $\\cos(x)$, $\\tan(x)$

$\\log(x)$, $\\ln(x)$, $\\exp(x)$`,
  },
];

defineExpose({
  toggleGuide,
});
</script>

<template>
  <!-- Modal overlay -->
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click="closeGuide"
  >
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50"></div>

    <!-- Modal content -->
    <div
      class="relative w-full max-w-7xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-green-600 text-white"
      >
        <h2 class="text-xl font-bold">📝 Hướng dẫn Markdown & MathJax</h2>
        <va-button
          icon="close"
          color="transparent"
          size="small"
          @click="closeGuide"
          class="text-white hover:bg-white hover:bg-opacity-20"
        >
        </va-button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b bg-gray-50">
        <button
          @click="activeTab = 'markdown'"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'markdown'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
          ]"
        >
          📄 Markdown
        </button>
        <button
          @click="activeTab = 'math'"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'math'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
          ]"
        >
          🧮 MathJax
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-hidden">
        <!-- Markdown Tab -->
        <div
          v-if="activeTab === 'markdown'"
          class="h-full p-4 overflow-y-auto bg-gray-50"
        >
          <div class="space-y-6">
            <div
              v-for="(section, index) in markdownSections"
              :key="index"
              class="bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <!-- Section header -->
              <div class="bg-gray-50 px-4 py-2 border-b">
                <h3 class="font-semibold text-gray-800">{{ section.title }}</h3>
              </div>

              <!-- Content split -->
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <!-- Code side -->
                <div class="border-b lg:border-b-0 lg:border-r">
                  <div
                    class="p-3 bg-gray-100 text-xs font-mono text-gray-600 border-b flex justify-between items-center"
                  >
                    <span>💻 Mã Markdown</span>
                    <va-button
                      size="small"
                      color="primary"
                      icon="content_copy"
                      @click="copyToClipboard(section.code)"
                      class="text-xs"
                      title="Sao chép mã"
                    >
                      Sao chép
                    </va-button>
                  </div>
                  <div class="p-4">
                    <pre
                      class="text-sm bg-gray-50 p-3 rounded overflow-x-auto"
                    ><code>{{ section.code }}</code></pre>
                  </div>
                </div>

                <!-- Result side -->
                <div>
                  <div
                    class="p-3 bg-green-100 text-xs font-mono text-green-700 border-b"
                  >
                    ✨ Kết quả hiển thị
                  </div>
                  <div class="p-4">
                    <MdPreview
                      :modelValue="section.result"
                      language="en-US"
                      :style="{
                        border: 'none',
                        backgroundColor: 'transparent',
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Math Tab -->
        <div
          v-if="activeTab === 'math'"
          class="h-full p-4 overflow-y-auto bg-gray-50"
        >
          <div class="space-y-6">
            <div
              v-for="(section, index) in mathSections"
              :key="index"
              class="bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <!-- Section header -->
              <div class="bg-gray-50 px-4 py-2 border-b">
                <h3 class="font-semibold text-gray-800">{{ section.title }}</h3>
              </div>

              <!-- Content split -->
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <!-- Code side -->
                <div class="border-b lg:border-b-0 lg:border-r">
                  <div
                    class="p-3 bg-gray-100 text-xs font-mono text-gray-600 border-b flex justify-between items-center"
                  >
                    <span>💻 Mã MathJax</span>
                    <va-button
                      size="small"
                      color="primary"
                      icon="content_copy"
                      @click="copyToClipboard(section.code)"
                      class="text-xs"
                      title="Sao chép mã"
                    >
                      Sao chép
                    </va-button>
                  </div>
                  <div class="p-4">
                    <pre
                      class="text-sm bg-gray-50 p-3 rounded overflow-x-auto"
                    ><code>{{ section.code }}</code></pre>
                  </div>
                </div>

                <!-- Result side -->
                <div>
                  <div
                    class="p-3 bg-green-100 text-xs font-mono text-green-700 border-b"
                  >
                    ✨ Kết quả hiển thị
                  </div>
                  <div class="p-4">
                    <MdPreview
                      :modelValue="section.result"
                      language="en-US"
                      :style="{
                        border: 'none',
                        backgroundColor: 'transparent',
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t bg-gray-50 text-center">
        <p class="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Bạn có thể sao chép các ví dụ ở cột "Code" và
          dán vào editor để thử nghiệm!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
