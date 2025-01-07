document.addEventListener("DOMContentLoaded", () => {
  const breadTypes = [
    { name: "#270 Bread", price: 270 },
    { name: "#350 Bread", price: 350 },
    { name: "#450 Bread", price: 450 },
    { name: "#600 Bread", price: 600 },
    { name: "#1000 Bread", price: 1000 },
    { name: "#1200 Bread", price: 1200 },
  ];

  // Time Display
  const currentDateEl = document.getElementById("current-date");
  const today = new Date().toLocaleDateString();
  if (currentDateEl) currentDateEl.textContent = `Date: ${today}`;

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

  // Initialize table
  populateDailyStockTable();
});
