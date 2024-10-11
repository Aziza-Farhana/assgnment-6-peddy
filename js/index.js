const loadCards = () => {
    console.log("Load Cards created");
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            console.log("Data received:", data);
            displayPets(data.pets);
        })
        .catch((err) => console.error("Fetch error:", err));
};

const displayPets = (pets) => {
    const cardContainer = document.getElementById("cards");
    cardContainer.innerHTML = "";
    if (pets.length === 0) {
        cardContainer.classList.remove("grid");
        cardContainer.innerHTML = `
        <div class="min-h-[500] flex flex-col gap-5 justify-center items-center bg-gray-100 py-5 lg:py-10 rounded-xl md:mx-5 lg:mx-10">
            <img src="images/error.webp">
            <h1 class="text-2xl text-center font-bold">No Information Available</h1>
            <p class="text-sm text-center text-gray-700 md:mx-5 lg:mx-10">Thank you for your interest in our pet cats. Unfortunately, we are currently out of stock. We appreciate your understanding and would be happy to notify you when they become available again.</p>
        </div>`;
        return;
    } else {
        cardContainer.classList.add("grid");
    }

    pets.forEach((pet) => {
        const cards = document.createElement("div");
        cards.classList = "card";
        cards.innerHTML = `
            <figure class="px-5 pt-2 border-1 border-gray-100">
                <img src="${pet.image}" class="rounded-xl" />
            </figure>
            <div class="mx-5">
                <h2 class="card-title font-bold">${pet.pet_name}</h2>
            </div> 
            <div class="mx-5">
                <p class="text-sm text-gray-500"><i class="fa-regular fa-clipboard"></i> Breed: ${pet.breed}</p>
                <p class="text-sm text-gray-500"><i class="fa-regular fa-calendar-days"></i> Birth: ${pet.date_of_birth || 'N/A'}</p>
                <p class="text-sm text-gray-500"><i class="fa-solid fa-mercury"></i> Gender: ${pet.gender}</p>
                <p class="text-sm text-gray-500"><i class="fa-solid fa-dollar-sign"></i> Price: ${pet.price}$</p>
            </div>
            <div class="divider mx-5 my-0"></div>
            <div class="card-action text-center my-2 text-gray-700">
                <button class="btn btn-outline btn-sm"><i class="fa-regular fa-thumbs-up"></i></button>
                <button class="btn btn-outline btn-sm" onclick="startCountdown()">Adopt</button>
                <button class="btn btn-outline btn-sm" onclick='showDetails("${pet.pet_name}", "${pet.breed}", "${pet.date_of_birth || 'N/A'}", "${pet.gender}", "${pet.price}", "${pet.image}")'>Details</button>
            </div>
        `;

        cards.style.border = "1px solid #D3D3D3";
        cardContainer.append(cards);
    });
};

const showDetails = (name, breed, dob, gender, price, image) => {
    console.log("Showing details for:", { name, breed, dob, gender, price, image });
    
    let detailsModal = document.getElementById("details_modal");
    if (!detailsModal) {
        detailsModal = document.createElement("dialog");
        detailsModal.id = "details_modal";
        detailsModal.className = "modal";
        detailsModal.innerHTML = `
            <div class="modal-box">
                <h3 class="text-lg font-bold">Pet Details</h3>
                <p id="modal-content" class="py-4"></p>
                <div class="modal-action">
                    <button class="btn" onclick="document.getElementById('details_modal').close()">Close</button>
                </div>
            </div>
        `;
        document.body.append(detailsModal);
    }
    
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
        <img src="${image}" class="rounded-xl" />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Breed:</strong> ${breed}</p>
        <p><strong>Birth:</strong> ${dob}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Price:</strong> ${price}$</p>
    `;
    detailsModal.showModal();
};

const startCountdown = () => {
    const countdownModal = document.createElement("dialog");
    countdownModal.id = "countdown_modal";
    countdownModal.className = "modal";
    countdownModal.innerHTML = `
        <div class="modal-box">
            <h3 class="text-lg font-bold">Adoption Countdown</h3>
            <p id="countdown-message" class="py-4">You are adopting...</p>
            <div class="modal-action">
                <button class="btn" id="close-countdown">Close</button>
            </div>
        </div>
    `;
    document.body.append(countdownModal);

    const countdownMessage = document.getElementById("countdown-message");
    let count = 3;

    const interval = setInterval(() => {
        if (count > 0) {
            countdownMessage.innerText = `Adopting in ${count}...`;
            count--;
        } else {
            clearInterval(interval);
            countdownMessage.innerText = "Congratulations dear customer! You have successfully adopted the pet.";
            setTimeout(() => {
                countdownModal.close();
                document.body.removeChild(countdownModal); 
            }, 2000);
        }
    }, 1000);

    countdownModal.showModal();


    document.getElementById('close-countdown').onclick = () => {
        countdownModal.close();
        clearInterval(interval); 
        document.body.removeChild(countdownModal); 
    };
};

const loadCategories = () => {
    console.log("Load Categories created");
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((err) => console.log(err));
};

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories");
    categories.forEach((item) => {
        const button = document.createElement("button");
        const img = document.createElement("img");
        img.src = item.category_icon;
        img.style.height = "30px";
        img.style.display = 'inline-block';
        img.style.margin = '5px';
        button.className = "category-button category-btn";
        button.style.backgroundColor = 'white';
        button.style.color = 'Black';
        button.style.border = '1px solid gray';
        button.style.padding = '10px 40px';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px boldest';
        button.style.display = 'flex';
        button.style.flexDirection = 'row';
        button.style.margin = "5px 10px";
        button.appendChild(img);
        button.appendChild(document.createTextNode(item.category));
        button.addEventListener('mouseover', function () {
            button.style.borderRadius = '35px';
        });
        button.addEventListener('click', () => loadCategoryPets(item.category));
        button.addEventListener('mouseout', function () {
            button.style.borderRadius = '5px';
        });
        categoryContainer.append(button);
    });
};

const loadCategoryPets = (category) => {
    console.log(`Load Pets for category: ${category}`);
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${category.toLowerCase()}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => displayPets(data.data))
        .catch((err) => console.error("Fetch error: ", err));
};


loadCards();
loadCategories();
