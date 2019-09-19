"use strict"
const fetchLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";
const familyLink = "http://petlatkea.dk/2019/hogwartsdata/families.json";
const sortBtn = document.querySelectorAll(".inputSort");
const filterBtn = document.querySelectorAll(".inputFilter");

let i, x, y, house_1, house_2, house_3, house_4, expelled, attending, half, expelBtn, prefectBtn, squadBtn, familyNames;
i = 0;
let pure = 0;
let executed = false;
let actualFilter;

let studentArray = [];
let fullArray = [];
let housesNumber = {
    Hufflepuff: "",
    Gryffindor: "",
    Ravenclaw: "",
    Slytherin: "",
}

/* JSONFetch();

function JSONFetch() {
    fetch(fetchLink).then(result => result.json()).then(data => createArray(data));
};
 */
const urls = [
    'http://petlatkea.dk/2019/hogwartsdata/families.json',
    'http://petlatkea.dk/2019/hogwartsdata/students.json'
];

// use map() to perform a fetch and handle the response for each url
Promise.all(urls.map(url =>
        fetch(url)
        .then(checkStatus)
        .then(parseJSON)
        .catch(error => console.log('There was a problem!', error))
    ))
    .then(data => {
        const students = data[1];
        const familyNames = data[0];

        createBloodArray(familyNames);
        createArray(students);

    })

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function parseJSON(response) {
    return response.json();
}

function createBloodArray(data) {
    familyNames = data;
}

/* function FamilyFetch(familyLink) {
    fetch(familyLink).then(result => result.json()).then(familyNames => checkBlood(familyNames, studentArray));
}
 */
/* function JSONFetch(fetchLink) {
    var request = new XMLHttpRequest();
    request.open('GET', fetchLink, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            createArray(data);
        }
    };
    request.send();
}

function FamilyFetch(familyLink) {
    var request = new XMLHttpRequest();
    request.open('GET', familyLink, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            createBloodType(data);
        }
    };
    request.send();
} */





function createArray(data) {
    data.forEach(data => {
        let student = {
            firstName: "",
            lastName: "",
            middleName: "",
            nickName: "",
            house: "",
            fullName: "",
            gender: "",
            prefect: false,
            prefectHouse: "z",
            blood: "",
            squad: "1",
            expelled: false,
            photo: true,
            sameFirstLetter: false,
            id: "",
        }
        student.fullName = data.fullname.trim();
        student.house = data.house.trim();
        student.gender = data.gender;
        studentArray.push(student);
        separateNames(student);
        Casing(student);
        addID(student);
    })



    /*  fetch(familyLink).then(result => result.json()).then(familyNames => checkBlood(familyNames, studentArray)); */
    /* console.log(studentArray[3].blood); */

    studentArray[3].photo = studentArray[9].photo = false;
    studentArray[27].squad = studentArray[29].squad = studentArray[33].squad = studentArray[31].squad = "0";
    studentArray[14].sameFirstLetter = studentArray[19].sameFirstLetter = true;
    checkBlood(familyNames, studentArray);
    fullArray = studentArray;
    countStudents(fullArray);
    createStudentList(studentArray);
    addFilterListeners(studentArray);
    addSortListeners(studentArray);
}

function addID(student) {
    student.id = i;
    i++;

}

function checkBlood(familyNames, studentArray) {
    pure = familyNames.pure;
    half = familyNames.half;
    console.log(studentArray);

    for (i = 0; i < studentArray.length; i++) {
        for (x = 0; x < pure.length; x++) {
            if (studentArray[i].lastName == pure[x]) {
                studentArray[i].blood = "pure";
            }

        }
        for (y = 0; y < half.length; y++) {
            if (studentArray[i].lastName == half[y]) {
                studentArray[i].blood = "half";
            }
        }
        if ((studentArray[i].blood !== "half") && (studentArray[i].blood !== "pure")) {
            studentArray[i].blood = "plain";
        }
        console.log(studentArray[i].blood);
    }
}

function addFilterListeners(studentArray) {
    filterBtn.forEach(e => {
        e.addEventListener("click", e => {
            filterElements(e, studentArray)
        })
    });
}

//SEPARATE
function separateNames(student) {
    let i, spaces = 0;
    let lastSpace = student.fullName.lastIndexOf(" ");
    let space = student.fullName.indexOf(" ");

    //Check if the name has more than first name
    if (student.fullName.includes(" ")) {
        student.firstName = student.fullName.substring(0, space);
        student.lastName = student.fullName.substring(lastSpace + 1);
    } else {
        student.firstName = student.fullName;
    }

    //Spaces counter
    for (i = 0; i < student.fullName.length; i++) {
        if (student.fullName[i] == " ") {
            spaces++;
        }
    }

    //Check Nickname or Middle name
    switch (spaces) {
        case 2:
            if (student.fullName[space + 1] == "\"") {
                student.nickName = student.fullName.substring(space + 2, lastSpace - 1);
            } else {
                student.middleName = student.fullName.substring(space + 1, lastSpace);
            }
    }


}

function createStudentList(studentArray) {
    console.log(studentArray);
    document.querySelector('.students_fill').textContent = "";
    for (i = 0; i < studentArray.length; i++) {
        let clone = document.querySelector(".template_students").content.cloneNode(true);
        if (studentArray[i].photo == false) {
            clone.querySelector(".student_photo").src = "img/no-photo.png";
        }
        if (studentArray[i].sameFirstLetter == true) {
            clone.querySelector(".student_photo").src = "img/students/" + studentArray[i].lastName.toLowerCase() + "_" + studentArray[i].firstName.toLowerCase() + ".png";
        }
        if ((studentArray[i].photo == true) && (studentArray[i].sameFirstLetter == false)) {
            clone.querySelector(".student_photo").src = "img/students/" + studentArray[i].lastName.toLowerCase() + "_" + studentArray[i].firstName.substring(0, 1).toLowerCase() + ".png";
        }
        if (studentArray[i].prefect == true) {
            clone.querySelector(".student_prefect").src = "img/prefect_" + studentArray[i].house + ".png";
        }
        if (studentArray[i].squad == "0") {
            clone.querySelector(".student_squad").src = "img/squad.png";
        }

        clone.querySelector(".student_blood").src = "img/" + studentArray[i].blood + ".png";
        clone.querySelector(".firstName").textContent = studentArray[i].firstName;
        clone.querySelector(".lastName").textContent = studentArray[i].lastName;
        clone.querySelector(".student_house").textContent = studentArray[i].house;
        clone.querySelector(".student").id = studentArray[i].id;
        document.querySelector('.students_fill').appendChild(clone);
    }

    //
    addStudentListener();

    function addStudentListener() {
        document.querySelectorAll(".student").forEach(li => {
            li.addEventListener("click", e => {
                fillProfile(e, studentArray);
            })
        })
    }
}




/* function sortArrays(studentArray) {

    document.querySelectorAll(".inputSort").forEach(function (e) {
        if (e.checked) {
            if (e.classList.contains("sortByFirstName")) {
                studentArray = studentArray.sort(function (a, b) {
                    return a.firstName.localeCompare(b.firstName);
                });
            }
            if (e.classList.contains("sortByLastName")) {
                studentArray = studentArray.sort(function (a, b) {
                    return a.lastName.localeCompare(b.lastName);
                });
            }
            if (e.classList.contains("sortByHouse")) {
                studentArray = studentArray.sort(function (a, b) {
                    return a[house].localeCompare(b[house]);
                });
            }

        }
    })
} */

function sortArrays(e, studentArray) {
    let sortBy;
    switch (e.target.id) {
        case "firstName":
            sortBy = "firstName";
            break;
        case "lastName":
            sortBy = "lastName";
            break;
        case "house":
            sortBy = "house";
            break;
        case "blood":
            sortBy = "blood";
            break;
        case "prefect":
            sortBy = "prefectHouse";
            break;
        case "membership":
            sortBy = "squad";
            break;
    }

    studentArray = studentArray.sort((a, b) => {
        return a[sortBy].localeCompare(b[sortBy]);
    })
    console.log(studentArray);


    createStudentList(studentArray);
}

function filterElements(e, studentArray) {
    let selected;
    if (e == null) {
        selected = "All";
        console.log(e);
    } else {
        selected = e.target.id;
    }

    studentArray = studentArray.filter(filterByHouse);

    function filterByHouse(student) {
        if (selected === "All") {
            return true;
        }
        if ((selected === "Expelled") && (student.expelled == true)) {
            return true;
        }
        if ((selected === "Attending") && (student.expelled == false)) {
            return true;
        }
        if (student.house === selected) {
            return true;
        } else return false;
    }
    createStudentList(studentArray);
    actualFilter = e;
    addSortListeners(studentArray);

}

function addSortListeners(studentArray) {
    sortBtn.forEach(e => {
        e.addEventListener("click", e => {
            sortArrays(e, studentArray)
        })
    });
}

function Casing(student) {
    for (let objects in student) {
        if (!((student[objects] == false) || (student[objects] == true))) {
            student[objects] = student[objects].toLowerCase();
            student[objects] = student[objects].substring(0, 1).toUpperCase() + student[objects].slice(1);
        }
    }

}

function countStudents(studentArray) {
    house_1 = house_2 = house_3 = house_4 = expelled = attending = 0;
    for (i = 0; i < studentArray.length; i++) {
        switch (studentArray[i].house) {
            case "Hufflepuff":
                house_1++;
                break;
            case "Gryffindor":
                house_2++;
                break;
            case "Ravenclaw":
                house_3++;
                break;
            case "Slytherin":
                house_4++;
                break;
        }
        if (studentArray[i].expelled == true) {
            expelled++;
        } else {
            attending++;
        }
    }

    document.querySelector(".list_number_all").textContent = studentArray.length;
    document.querySelector(".list_number_attending").textContent = attending;
    document.querySelector(".list_number_house_1").textContent = house_1;
    document.querySelector(".list_number_house_2").textContent = house_2;
    document.querySelector(".list_number_house_3").textContent = house_3;
    document.querySelector(".list_number_house_4").textContent = house_4;
    document.querySelector(".list_number_expelled").textContent = expelled;

}


function fillProfile(e, studentArray) {
    console.log(e.target.parentElement);
    let photo = e.target.parentElement.children[0].src;
    let id = e.target.parentElement.id;
    let studentClicked, status;
    console.log(studentArray);
    for (i = 0; i < studentArray.length; i++) {
        if (studentArray[i].id == id) {
            studentClicked = studentArray[i];
            console.log(studentClicked);
        }
    }


    console.log(studentClicked.firstName);
    const placeholder = document.querySelector(".placeholder_student_profile");
    placeholder.innerHTML = "";
    let clone = document.querySelector(".template_student_profile").content.cloneNode(true);
    clone.querySelector(".student_profile_firstName").innerHTML = "<span>First name: </span>" + studentClicked.firstName;
    if (studentClicked.middleName !== "") {
        clone.querySelector(".student_profile_middleName").innerHTML = "<span>Middle name: </span>" + studentClicked.middleName;
    }
    if (studentClicked.nickName !== "") {
        clone.querySelector(".student_profile_nickName").innerHTML = "<span>Nick name: </span>" + studentClicked.nickName;
    }
    if (studentClicked.lastName !== "") {
        clone.querySelector(".student_profile_lastName").innerHTML = "<span>Last name: </span>" + studentClicked.lastName;
    }
    if (studentClicked.expelled == true) {
        status = "Expelled";
    } else {
        status = "Attending";
    }


    clone.querySelector(".expeled-status").innerHTML = status;
    clone.querySelector(".student_profile_photo").src = photo;
    clone.querySelector(".student_profile_crest").src = "img/housecrests/" + studentClicked.house.toLowerCase() + ".png";
    clone.querySelector(".expelBtn").innerHTML = "Expel";
    clone.querySelector(".expelBtn").id = studentClicked.id;
    placeholder.appendChild(clone);

    expelBtn = document.querySelector(".expelBtn");
    prefectBtn = document.querySelector(".prefectBtn");
    squadBtn = document.querySelector(".squadBtn");
    addProfileListeners(studentClicked, studentArray);
}


function addProfileListeners(studentClicked, studentArray) {
    expelBtn.addEventListener("click", function () {
        expelStudent(studentClicked, studentArray);
    });
    prefectBtn.addEventListener("click", function () {
        prefectStudent(studentClicked, fullArray);
    });
    squadBtn.addEventListener("click", function () {
        squadStudent(studentClicked, fullArray);
    })
}

function expelStudent(studentClicked, studentArray) {
    studentClicked.expelled = true;
    countStudents(fullArray);
    filterElements(actualFilter, studentArray);
}

function prefectStudent(studentClicked, fullArray) {
    if (housesNumber[studentClicked.house] < 2) {
        studentClicked.prefect = true;
        studentClicked.prefectHouse = studentClicked.house;
        housesNumber[studentClicked.house]++;
    } else {
        console.log("Fuck");
        showModal(studentClicked, fullArray);
    }
    filterElements(actualFilter, studentArray);
}

function showModal(studentClicked, studentArray) {

    document.querySelector('.modal_fill').textContent = "";
    for (i = 0; i < studentArray.length; i++) {
        if ((studentArray[i].prefect == true) && (studentArray[i].house == studentClicked.house)) {
            let clone = document.querySelector(".template_modal").content.cloneNode(true);

            if (studentArray[i].photo == false) {
                clone.querySelector(".modal_profile_photo").src = "img/no-photo.png";
            }
            if (studentArray[i].sameFirstLetter == true) {
                clone.querySelector(".modal_profile_photo").src = "img/students/" + studentArray[i].lastName.toLowerCase() + "_" + studentArray[i].firstName.toLowerCase() + ".png";
            }
            if ((studentArray[i].photo == true) && (studentArray[i].sameFirstLetter == false)) {
                clone.querySelector(".modal_profile_photo").src = "img/students/" + studentArray[i].lastName.toLowerCase() + "_" + studentArray[i].firstName.substring(0, 1).toLowerCase() + ".png";
            }
            if (studentArray[i].prefect == true) {
                clone.querySelector(".modal_prefect").src = "img/prefect_" + studentArray[i].house + ".png";
            }


            clone.querySelector(".modal_firstName").textContent = studentArray[i].firstName;
            clone.querySelector(".modal_lastName").textContent = studentArray[i].lastName;
            clone.querySelector(".modal_house").textContent = studentArray[i].house;
            clone.querySelector(".modal_student").id = studentArray[i].id;
            document.querySelector('.modal_fill').appendChild(clone);
        }
    }
}

function squadStudent(studentClicked, fullArray) {
    console.log(studentClicked, fullArray);
}