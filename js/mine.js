//  Getting the HTML elements
let productTitleInput = document.getElementById("productTitle");
let productPriceInput = document.getElementById("productPrice");
let productCategoryInput = document.getElementById("productCategory");
let productdescInput = document.getElementById("productdesc");
let productImageInput = document.getElementById("productImage");
let preview = document.getElementById("previewImage");
 let productSearchInput = document.getElementById("productSearch");
let btnAdd= document.getElementById("btnAdd");
let btnUpdate = document.getElementById("btnUpdate");
let productlocalKye = "allProduct";
let productList = [];

// Load products from localStorage on page load
if (JSON.parse(localStorage.getItem(productlocalKye))) {
    productList = JSON.parse(localStorage.getItem(productlocalKye));
    displayProducts(productList);
}
// addToLocalStorage function
function addToLocalStorage(){
  localStorage.setItem(productlocalKye, JSON.stringify(productList));
}
// Preview image function
function previewFile() {
    const file = productImageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove('d-none');
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Add product function
function addProduct() {
  const inputs = [
    productTitleInput,
    productPriceInput,
    productCategoryInput,
    productdescInput,
    productImageInput
  ];

  if (inputs.every(input => validateForm(input))) {
    // إنشاء كائن المنتج
    const product = {
      title: productTitleInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      desc: productdescInput.value,
      image: `./images/${productImageInput.files[0]?.name}`
    };

    productList.push(product);

    addToLocalStorage()
    clearForm();
    displayProducts(productList);
  }
}


// validateForm function
function validateForm(Input) {

  let regex = {
    productTitle: /^[A-Z][a-z]{2,15}$/,
    productPrice: /^(6000|[1-5][0-9]{4}|60000)$/, 
    productCategory: /^(TV|Mobile|Screens|Laptops|Electronics)$/,  
    productdesc: /^.{0,250}$/, 
    productImage: /\.(jpg|jpeg|png|gif)$/
  };
   let isValid = regex[Input.id].test(Input.value);
   if (isValid) {
    Input.classList.remove("is-invalid");
    Input.classList.add("is-valid");
    Input.nextElementSibling.classList.replace("d-block","d-none");

  } else {
    Input.classList.remove("is-valid");
    Input.classList.add("is-invalid");
    // console.log(Input.nextElementSibling);
    Input.nextElementSibling.classList.replace("d-none","d-block");
  }
  
  return isValid;

}

// Clear form and image preview
function clearForm(Product) {
    productTitleInput.value = Product ? Product.title : "";
    productPriceInput.value = Product ? Product.price : "";
    productCategoryInput.value = Product ? Product.category : "";
    productdescInput.value = Product ? Product.desc : "";
    preview.src = Product ? Product.image : ""; preview.classList.toggle('d-none', !Product);
    
    btnAdd.classList.remove("d-none");
    btnUpdate.classList.add("d-none");
  
  }

// Display products function
function displayProducts(list) {
    let bBox = "";

    for (let i = 0; i < list.length; i++) {
        bBox += `
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="product bg-white rounded-3 shadow-sm overflow-hidden position-relative">
                    <div class="product-image">
                        <img class="img-fluid w-100" src="${list[i].image}" alt="Product Image">
                    </div>
                    <div class="product-content p-4 text-center">
                        <h3 class="fw-bold text-dark mb-2">${list[i].name ? list[i].name : list[i].title }</h3>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge bg-primary text-white px-3 py-1">${list[i].category}</span>
                            <span class="text-muted">$${list[i].price}</span>
                        </div>
                        <p class="text-secondary">${list[i].desc}</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-outline-danger" data-index="${i}"  onclick="deleteProduct(${i})">
                                <i class="fas fa-trash"></i> 
                            </button>
                            <button class="btn btn-outline-success" data-index="${list[i].id}"  onclick="editProduct(${i})">
                                <i class="fas fa-edit"></i> 
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }
    addToLocalStorage();
    document.getElementById("ProductRow").innerHTML = bBox;
}


let updateIndex ; 

// Edit product function
function editProduct(editIndex) {
 
   updateIndex = editIndex;
    clearForm(productList[editIndex])
    btnAdd.classList.add("d-none");
    btnUpdate.classList.remove("d-none");
  
 
}

// Update product function
function updateProduct() {
  const newImage = productImageInput.files[0] ? `./images/${productImageInput.files[0].name}` : productList[updateIndex].image;

    productList[updateIndex] = {
    title: productTitleInput.value,
    price: productPriceInput.value,
    category: productCategoryInput.value,
    desc: productdescInput.value,
    image: newImage
  };

  addToLocalStorage();

  displayProducts(productList);

  clearForm();
}

// searchProductsByTitle function
function searchProductsByTitle(key) {
  const searchKey = key.toLowerCase();

  const matchedSearch = productList.filter(product => 
    product.title.toLowerCase().includes(searchKey)
  ).map(product => ({
    ...product,
    name: product.title.replace(
      new RegExp(searchKey, 'gi'),
      match => `<span class="text-info">${match}</span>`
    )
  }));

  displayProducts(matchedSearch);
}


// Delete product function
function deleteProduct(deletedIndex) {
    productList.splice(deletedIndex, 1);
    addToLocalStorage();
    displayProducts(productList);
}
