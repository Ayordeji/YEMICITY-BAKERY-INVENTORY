document.addEventListener("DOMContentLoaded", () => {
  const breadTypes = [
    { name: "#270 Bread", price: 270 },
    { name: "#350 Bread", price: 350 },
    { name: "#450 Bread", price: 450 },
    { name: "#600 Bread", price: 600 },
    { name: "#1000 Bread", price: 1000 },
    { name: "#1200 Bread", price: 1200 },
  ];

  const currentDateSpan = document.getElementById("current-date");
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  currentDateSpan.textContent = currentDate.toLocaleDateString("en-US", options);

  // Retrieve daily stock from localStorage
  const getDailyStock = () => JSON.parse(localStorage.getItem("dailyStock")) || [];

  // Save daily stock to localStorage
  const saveDailyStock = (data) => localStorage.setItem("dailyStock", JSON.stringify(data));

  // Populate Daily Stock Table
  function populateDailyStockTable() {
    const tableBody = document.querySelector("#daily-stock-table tbody");
    const dailyStock = getDailyStock();

    tableBody.innerHTML = "";
    breadTypes.forEach((bread, index) => {
      const stock = dailyStock.find((item) => item.name === bread.name) || { quantity: 0 };
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${bread.name}</td>
                <td>${bread.price}</td>
                <td><input type="number" value="${stock.quantity}" data-index="${index}" class="stock-input"></td>
            `;
      tableBody.appendChild(row);
    });
  }

  // Save daily stock values from inputs
  document.querySelector("#daily-stock-table").addEventListener("input", (e) => {
    if (e.target.classList.contains("stock-input")) {
      const index = e.target.getAttribute("data-index");
      const quantity = parseInt(e.target.value, 10) || 0;

      const dailyStock = getDailyStock();
      dailyStock[index] = { name: breadTypes[index].name, quantity };
      saveDailyStock(dailyStock);
    }
  });

  // Function to download the page as PDF
  const downloadPdfButton = document.getElementById("download-pdf");
  downloadPdfButton.addEventListener("click", () => {
    const element = document.body; // Select the entire page
    const options = {
      margin: 1,
      filename: "Bakery_Stock_Report.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait" },
    };

    // Load html2pdf.js library and generate PDF
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js";
    script.onload = () => {
      html2pdf().set(options).from(element).save();
    };
    script.onerror = () => {
      console.error("Failed to load html2pdf.js.");
      alert("An error occurred while loading the PDF library. Please try again.");
    };
    document.body.appendChild(script);
  });

  // Initialize table
  populateDailyStockTable();
});
