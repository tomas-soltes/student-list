"use strict"
const fetchLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";
const familyLink = "http://petlatkea.dk/2019/hogwartsdata/families.json";
const sortBtn = document.querySelectorAll(".inputSort");
const filterBtn = document.querySelectorAll(".inputFilter");

let i, x, y, house_1, house_2, house_3, house_4, expelled, attending, half, expelBtn, addPrefectBtn, removePrefectBtn, addSquadBtn, removeSquadBtn, familyNames, removeStudentBtn, foundStudent, actualFilter, addStudentPrefectBtn, targetClicked, randomNumber, bloodHackedStatus, hackedID;
let studentsNumber = 0;
let pure = 0;
let executed = false;
let alreadyRemoved = false;
let hacked = false;

let studentArray = [];
let fullArray = [];
let housesNumber = {
    Hufflepuff: "",
    Gryffindor: "",
    Ravenclaw: "",
    Slytherin: "",
}

let bloodArray = ["pure", "plain", "half"];

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
            hacked: false,
        }
        student.fullName = data.fullname.trim();
        student.house = data.house.trim();
        student.gender = data.gender;
        studentArray.push(student);
        separateNames(student);
        Casing(student);
        addID(student);
    })

    let firstStudentId = "";
    studentArray[9].photo = false;
    studentArray[27].squad = studentArray[29].squad = studentArray[33].squad = studentArray[31].squad = "0";
    studentArray[14].sameFirstLetter = studentArray[19].sameFirstLetter = true;
    checkBlood(familyNames, studentArray);
    fullArray = studentArray;
    countStudents(fullArray);
    createStudentList(studentArray);
    addFilterListeners(studentArray);
    addSortListeners(studentArray);
    fillProfile(firstStudentId, studentArray);
}

function addID(student) {
    student.id = studentsNumber;
    studentsNumber++;

}

function checkBlood(familyNames, studentArray) {
    pure = familyNames.pure;
    half = familyNames.half;

    for (i = 0; i < studentArray.length; i++) {
        studentArray[i].blood = "";
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

        if (hacked == true) {
            if (studentArray[i].blood == "plain") {
                bloodHackedStatus = "pure";
            }
            if (studentArray[i].blood == "pure") {
                randomNumber = Math.floor(Math.random(1) * Math.floor(3));
                bloodHackedStatus = bloodArray[randomNumber];
            }
            studentArray[i].blood = bloodHackedStatus;
        }
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
    if (hacked == true) {
        checkBlood(familyNames, studentArray);
    }
    document.querySelector('.students_fill').textContent = "";
    for (i = 0; i < studentArray.length; i++) {
        let clone = document.querySelector(".template_students").content.cloneNode(true);
        if (studentArray[i].photo == false) {
            clone.querySelector(".student_photo").src = "img/no-photo.png";
        } else if (studentArray[i].sameFirstLetter == true) {
            clone.querySelector(".student_photo").src = "img/students/" + studentArray[i].lastName.toLowerCase() + "_" + studentArray[i].firstName.toLowerCase() + ".png";
        } else if (studentArray[i].lastName.includes("-")) {
            x = studentArray[i].lastName.indexOf("-");
            x++;
            clone.querySelector(".student_photo").src = "img/students/" + studentArray[i].lastName.slice(x).toLowerCase() + "_" + studentArray[i].firstName.substring(0, 1).toLowerCase() + ".png";
        }
        else if (studentArray[i].id == hackedID) {
                   clone.querySelector(".student_photo").src = "img/students/voldemort.png";
               }
        else {
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


    createStudentList(studentArray);
}

function filterElements(e, studentArray) {
    let selected;
    if (e == null) {
        selected = "All";
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

    document.querySelector('.list_title_right').textContent = selected;
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
            if (student[objects].includes("-")) {
                x = student[objects].indexOf("-");
                x++;
                y = x + 1;
                student[objects] = student[objects].substring(0, x) + student[objects].substring(x, y).toUpperCase() + student[objects].slice(y);
            }
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
    let id, photo,studentClicked, status, squad_status, prefect_status;
    if (e == "") {
        id = 0;
        photo = document.querySelector(".student_photo").src;
    } else {
        photo = e.target.parentElement.children[0].src;
        id = e.target.parentElement.id;
    }

    targetClicked = e;
    studentClicked = findStudentByID(id);

    const placeholder = document.querySelector(".placeholder_student_profile");
    placeholder.innerHTML = "";
    let clone = document.querySelector(".template_student_profile").content.cloneNode(true);
    clone.querySelector(".student_profile_firstName").innerHTML = studentClicked.firstName;
    if (studentClicked.middleName !== "") {
        clone.querySelector(".student_profile_middleName").innerHTML = studentClicked.middleName;
    }
    if (studentClicked.nickName !== "") {
        clone.querySelector(".student_profile_nickName").innerHTML = studentClicked.nickName;
    }
    if (studentClicked.lastName !== "") {
        clone.querySelector(".student_profile_lastName").innerHTML = studentClicked.lastName;
    }
    if (studentClicked.expelled == true) {
        status = "Expelled";
    } else {
        status = "Attending";
        clone.querySelector(".expelBtn").textContent = "Expel";
        clone.querySelector(".expelBtn").id = studentClicked.id;
    }
    if (studentClicked.squad == "0") {
        squad_status = "Member of Inquisitorial Squad";
    } else {
        squad_status = "Not a member";
    }
    if (studentClicked.prefect == true) {
        prefect_status = "Prefect of " + studentClicked.house;
        clone.querySelector(".prefect_status_img").src = "img/prefect_" + studentClicked.house + ".png";
    } else {
        prefect_status = "Not a prefect";
    }

    clone.querySelector(".expelled_status").textContent = status;
    clone.querySelector(".membership_status").textContent = squad_status;
    clone.querySelector(".student_profile_photo").src = photo;
    clone.querySelector(".prefect_status").textContent = prefect_status;
    clone.querySelector(".blood_status").textContent = studentClicked.blood.substring(0, 1).toUpperCase() + studentClicked.blood.substring(1);
    clone.querySelector(".student_profile_crest").src = "img/housecrests/" + studentClicked.house.toLowerCase() + ".png";
    placeholder.appendChild(clone);

    if (studentClicked.middleName !== "") {
        document.querySelector(".student_profile_middleName_li").style.display = "grid";
    }
    if (studentClicked.nickName !== "") {
        document.querySelector(".student_profile_nickName_li").style.display = "grid";
    }
    if (studentClicked.lastName !== "") {
        document.querySelector(".student_profile_lastName_li").style.display = "grid";
    }

    expelBtn = document.querySelector(".expelBtn");
    addPrefectBtn = document.querySelector(".addPrefectBtn");
    removePrefectBtn = document.querySelector(".removePrefectBtn");
    addSquadBtn = document.querySelector(".addSquadBtn");
    removeSquadBtn = document.querySelector(".removeSquadBtn");

    if (studentClicked.expelled == false) {
        expelBtn.style.display = "block";
    }
    if (studentClicked.prefect == true) {
        addPrefectBtn.style.display = "none";
        removePrefectBtn.style.display = "block";
    } else {
        addPrefectBtn.style.display = "block";
        removePrefectBtn.style.display = "none";
    }
    if (studentClicked.squad == "0") {
        addSquadBtn.style.display = "none";
        removeSquadBtn.style.display = "block";
    } else {
        addSquadBtn.style.display = "block";
        removeSquadBtn.style.display = "none";
    }

    addProfileListeners(studentClicked, studentArray);
}


function addProfileListeners(studentClicked, studentArray) {
    expelBtn.addEventListener("click", function () {
        expelStudent(studentClicked, studentArray);
    });
    addPrefectBtn.addEventListener("click", function () {
        addPrefectStudent(studentClicked, fullArray);
    });
    removePrefectBtn.addEventListener("click", function () {
        removePrefectStudent(studentClicked, fullArray);
    });
    addSquadBtn.addEventListener("click", function () {
        addSquadStudent(studentClicked, fullArray);
    })
    removeSquadBtn.addEventListener("click", function () {
        removeSquadStudent(studentClicked, fullArray);
    })
}

function expelStudent(studentClicked, studentArray) {
    if (studentClicked.hacked) {
        document.querySelector(".modal_voldemort").style.visibility = "visible";
        setTimeout(function () {
            document.querySelector(".modal_voldemort").style.visibility = "hidden";
        }, 1500);
    } else {
        studentClicked.expelled = true;
        document.querySelector(".expelBtn").style.display = "none";
        countStudents(fullArray);
        filterElements(actualFilter, studentArray);
        fillProfile(targetClicked, studentArray);
    }
}

function addPrefectStudent(studentClicked, fullArray) {
    if (housesNumber[studentClicked.house] < 2) {
        studentClicked.prefect = true;
        studentClicked.prefectHouse = studentClicked.house;
        housesNumber[studentClicked.house]++;
        document.querySelector('.modal').style.display = "none";
    } else {
        showModal(studentClicked, fullArray);
    }
    filterElements(actualFilter, studentArray);
    fillProfile(targetClicked, studentArray);
}

function showModal(studentClicked, studentArray) {
    alreadyRemoved = false;
    document.querySelector('.modal').style.display = "block";
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
            clone.querySelector(".modal_student").id = studentArray[i].id;
            clone.querySelector(".remove_student").id = studentArray[i].id;
            clone.querySelector(".modal_add").style.display = "none";
            document.querySelector('.modal_fill').appendChild(clone);
        }
    }
    addRemovePrefectListeners(studentClicked);
}

function addRemovePrefectListeners(studentClicked) {
    removeStudentBtn = document.querySelectorAll(".remove_student");
    removeStudentBtn.forEach(e => {
        e.addEventListener("click", e => {
            removePrefect(e, studentClicked);
        })
    });
}

function removePrefect(e, studentClicked) {
    foundStudent = findStudentByID(e.target.id);
    foundStudent.prefectHouse = "z";
    foundStudent.prefect = false;
    housesNumber[studentClicked.house]--;
    e.target.parentElement.parentElement.style.display = "none";
    if (!alreadyRemoved) {
        addPrefectAddingOption(studentClicked);
        alreadyRemoved = true;
    };
}

function addPrefectAddingOption(studentClicked) {
    let clone = document.querySelector(".template_modal").content.cloneNode(true);
    clone.querySelector(".modal_profile_photo").src = document.querySelector(".student_profile_photo").src;
    clone.querySelector(".modal_firstName").textContent = studentClicked.firstName;
    clone.querySelector(".modal_lastName").textContent = studentClicked.lastName;
    clone.querySelector(".modal_student").id = studentClicked.id;
    clone.querySelector(".modal_remove").style.display = "none";
    clone.querySelector(".add_student").style.display = "block";
    document.querySelector('.modal_fill').appendChild(clone);
    addPrefectListener(studentClicked);
}

function addPrefectListener(studentClicked) {
    addStudentPrefectBtn = document.querySelectorAll(".add_student");
    addStudentPrefectBtn.forEach(e => {
        e.addEventListener("click", e => {
            addPrefectStudent(studentClicked);
        })
    });
}


function addSquadStudent(studentClicked) {
    if ((studentClicked.blood == "pure") || (studentClicked.house == "Slytherin")) {
        studentClicked.squad = "0";
        addSquadBtn.style.display = "none";
        removeSquadBtn.style.display = "block";
        countStudents(fullArray);
        filterElements(actualFilter, studentArray);
        fillProfile(targetClicked, studentArray);
        if (hacked == true) {
            setTimeout(function () {
                removeSquadStudent(studentClicked);
            }, 2000);
        }
    } else {
        alert("The student has not pure blood");
    }
}


function removeSquadStudent(studentClicked) {
    studentClicked.squad = "1";
    addSquadBtn.style.display = "block";
    removeSquadBtn.style.display = "none";
    countStudents(fullArray);
    filterElements(actualFilter, studentArray);
    fillProfile(targetClicked, studentArray);
}

function removePrefectStudent(studentClicked) {
    studentClicked.prefect = false;
    housesNumber[studentClicked.house]--;
    addPrefectBtn.style.display = "block";
    removePrefectBtn.style.display = "none";
    countStudents(fullArray);
    filterElements(actualFilter, studentArray);
    fillProfile(targetClicked, studentArray);
}

function findStudentByID(id) {
    function findStudent(obj) {
        if (obj.id == id) {
            return true;
        } else {
            return false;
        }
    }

    const found = fullArray.find(findStudent);

    return found;
}
console.log("Write 'hackHogwarts('Your name')' to heck into a Hogwarts student list");

function hackHogwarts(name) {
    let student = {
        firstName: "",
        lastName: "",
        middleName: "",
        nickName: "",
        house: "Slytherin",
        fullName: "",
        gender: "boy",
        prefect: false,
        prefectHouse: "z",
        blood: "pure",
        squad: "1",
        expelled: false,
        photo: true,
        sameFirstLetter: false,
        id: "",
        hacked: true,
    }
    hacked = true;
    student.fullName = name;
    studentArray.push(student);
    separateNames(student);
    Casing(student);
    addID(student);
    hackedID = student.id;
    countStudents(fullArray);
    filterElements(actualFilter, studentArray);
}