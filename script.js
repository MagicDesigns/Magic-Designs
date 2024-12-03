// تعريف الحقول
let title = document.getElementById("title");
let price = document.getElementById("price");
let discount = document.getElementById("discount");
let search = document.getElementById("search");
let tbody = document.getElementById("tbody");

// التحقق من وجود بيانات في LocalStorage
let prodList = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];

// تحديث إجمالي العهدة والمصاريف
function calculateTotals() {
    let totalAdvances = 0;
    let totalExpenses = 0;

    prodList.forEach(prod => {
        totalAdvances += parseFloat(prod.price) || 0;
        totalExpenses += parseFloat(prod.discount) || 0;
    });

    document.getElementById("totalAdvances").textContent = totalAdvances.toFixed(2);
    document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
    document.getElementById("difference").textContent = (totalAdvances - totalExpenses).toFixed(2);
}

// إنشاء بيانات جديدة
function createProd() {
    if (title.value !== "" && price.value !== "" && discount.value !== "") {
        let thisProd = {
            title: title.value,
            price: parseFloat(price.value),
            discount: parseFloat(discount.value),
        };

        prodList.push(thisProd);
        saveProd();
        clearInputs();
        showData();
    }
}

// حفظ البيانات في LocalStorage
function saveProd() {
    localStorage.setItem("products", JSON.stringify(prodList));
}

// مسح الحقول
function clearInputs() {
    title.value = "";
    price.value = "";
    discount.value = "";
}

// عرض البيانات في الجدول
function showData() {
    let table = ``;

    prodList.forEach((prod, index) => {
        table += `
            <tr>
                <td>${index + 1}</td>
                <td>${prod.price}</td>
                <td>${prod.discount}</td>
                <td>${prod.title}</td>
                <td><input onclick="updateProd(${index})" type="button" value="تحديث"></td>
                <td><input onclick="deleteProd(${index})" type="button" value="حذف"></td>
            </tr>`;
    });

    tbody.innerHTML = table;
    calculateTotals();
}

// تحديث بيانات
function updateProd(index) {
    let prod = prodList[index];
    title.value = prod.title;
    price.value = prod.price;
    discount.value = prod.discount;

    document.getElementById("create").setAttribute("onclick", `submitUpdate(${index})`);
}

// حفظ التحديث
function submitUpdate(index) {
    prodList[index] = {
        title: title.value,
        price: parseFloat(price.value),
        discount: parseFloat(discount.value),
    };

    saveProd();
    clearInputs();
    showData();
    document.getElementById("create").setAttribute("onclick", "createProd()");
}

// حذف منتج
function deleteProd(index) {
    prodList.splice(index, 1);
    saveProd();
    showData();
}

// البحث
function searchData() {
    let query = search.value.toLowerCase();
    let filtered = prodList.filter(prod =>
        prod.title.toLowerCase().includes(query) || prod.price.toString().includes(query)
    );

    let table = ``;
    filtered.forEach((prod, index) => {
        table += `
            <tr>
                <td>${index + 1}</td>
                <td>${prod.price}</td>
                <td>${prod.discount}</td>
                <td>${prod.title}</td>
                <td><input onclick="updateProd(${index})" type="button" value="تحديث"></td>
                <td><input onclick="deleteProd(${index})" type="button" value="حذف"></td>
            </tr>`;
    });

    tbody.innerHTML = table;
}

// عرض البيانات عند تحميل الصفحة
showData();
