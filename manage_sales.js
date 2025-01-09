document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const breadTypes = [
    { name: "#270 Bread", price: 270 },
    { name: "#350 Bread", price: 350 },
    { name: "#450 Bread", price: 450 },
    { name: "#600 Bread", price: 600 },
    { name: "#1000 Bread", price: 1000 },
    { name: "#1200 Bread", price: 1200 },
  ];

  const salesTableBody = document.querySelector("#sales-record-table tbody");
  const deleteAllButton = document.getElementById("delete-all");
  const downloadPdfButton = document.getElementById("download-pdf");

  // Event listener to delete all records
  deleteAllButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all sales records?")) {
      salesTableBody.innerHTML = ""; // Clear all rows from the sales record table
      localStorage.removeItem("salesRecords"); // Clear sales records from localStorage
      populateSalesRecordsTable(); // Update table display
      alert("All sales records have been deleted.");
    }
  });

  // Function to download the page as a PDF
  downloadPdfButton.addEventListener("click", () => {
    const element = document.body; // Select the entire page
    const options = {
      margin: 1,
      filename: "Bakery_Sales_Report.pdf",
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

  // Date Display
  const currentDateSpan = document.getElementById("current-date");
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  currentDateSpan.textContent = currentDate.toLocaleDateString("en-US", options);

  // Retrieve data from localStorage
  const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];

  // Save data to localStorage
  const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  // Populate Sales Records Table
  function populateSalesRecordsTable() {
    const tableBody = document.querySelector("#sales-record-table tbody");
    const salesData = getData("salesRecords");

    tableBody.innerHTML = "";
    let totalSalesAmount = 0;

    salesData.forEach((sale, index) => {
      const totalSales = sale.price * sale.quantity;
      totalSalesAmount += totalSales;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sale.name}</td>
        <td>${sale.price}</td>
        <td>${sale.quantity}</td>
        <td>${totalSales}</td>
        <td><button class="delete-sale cta-button secondary" data-index="${index}">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });

    // Display Total Sales Amount
    const totalSalesElement = document.querySelector("#total-sales");
    if (!totalSalesElement) {
      const totalSalesRow = document.createElement("div");
      totalSalesRow.id = "total-sales";
      totalSalesRow.textContent = `Total Sales: ₦${totalSalesAmount}`;
      document.querySelector("#sales-record-table").after(totalSalesRow);
    } else {
      totalSalesElement.textContent = `Total Sales: ₦${totalSalesAmount}`;
    }

    // Populate Stock Left Table
    populateStockLeftTable();
  }

  // Populate Stock Left Table
  function populateStockLeftTable() {
    const stockLeftBody = document.querySelector("#stock-left-table tbody");
    const dailyStock = getData("dailyStock");
    const salesRecords = getData("salesRecords");

    const stockLeft = dailyStock.map((stock) => {
      const soldQuantity = salesRecords.filter((sale) => sale.name === stock.name).reduce((sum, sale) => sum + sale.quantity, 0);

      return {
        name: stock.name,
        quantityLeft: stock.quantity - soldQuantity,
        quantitySold: soldQuantity,
      };
    });

    stockLeftBody.innerHTML = "";
    stockLeft.forEach((stock) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${stock.name}</td>
        <td>${stock.quantityLeft}</td>
        <td>${stock.quantitySold}</td>
      `;
      stockLeftBody.appendChild(row);
    });
  }

  // Handle Sales Form Submission
  const salesForm = document.querySelector("#sales-form");
  salesForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const salesType = document.querySelector("#sales-type").value;
    const salesQuantity = parseInt(document.querySelector("#sales-quantity").value, 10);
    const bread = breadTypes.find((b) => b.name === salesType);

    if (!salesType || isNaN(salesQuantity) || !bread) return;

    // Check stock availability
    const dailyStock = getData("dailyStock");
    const stockItem = dailyStock.find((item) => item.name === salesType);
    if (stockItem && salesQuantity > stockItem.quantity) {
      alert("Insufficient stock! Please adjust the quantity.");
      return;
    }

    const salesRecords = getData("salesRecords");
    salesRecords.push({ name: salesType, price: bread.price, quantity: salesQuantity });

    saveData("salesRecords", salesRecords);
    populateSalesRecordsTable();
    alert("Sales record added successfully!");
  });

  // Handle Delete Sale
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-sale")) {
      const index = e.target.getAttribute("data-index");
      if (confirm("ARE YOU SURE?")) {
        const salesRecords = getData("salesRecords");
        salesRecords.splice(index, 1);
        saveData("salesRecords", salesRecords);
        populateSalesRecordsTable();
      }
    }
  });

  // Initialize dropdowns
  function initializeDropdowns() {
    const salesTypeDropdown = document.querySelector("#sales-type");
    salesTypeDropdown.innerHTML = '<option value="">Select Bread Type</option>';
    breadTypes.forEach((bread) => {
      const option = document.createElement("option");
      option.value = bread.name;
      option.textContent = bread.name;
      salesTypeDropdown.appendChild(option);
    });
  }

  // Initialize the page
  initializeDropdowns();
  populateSalesRecordsTable();
});
