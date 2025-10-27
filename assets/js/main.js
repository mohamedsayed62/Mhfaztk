let btnToggle = document.querySelector(".btn-toggle");
let mobileMenu = document.getElementById("mobile-menu");

let lst = JSON.parse(localStorage.getItem("wallet")) || [];

let classTreats = "table-content grid grid-cols-5 text-center text-gray-900 py-5 bdr-btm scroll";

let lstIds = ["date", "descreption", "treat", "category", "amount"];

let date = new Date().toISOString().split('T')[0];

  let btns = document.querySelectorAll(".btn");

  btns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!(btn.classList.contains("active"))) {
      let remBtn = document.querySelector(".active"); // select activation Btn to remove active
      remBtn.classList.remove("active", "bg-red-600", "text-white");
      remBtn.classList.add("text-red-400");
      btn.classList.add("active", "bg-red-600", "text-white");
      btn.classList.remove("text-red-400");
    }
  })
  });

function handelScroll() {
  let allScroll = document.querySelectorAll(".scroll");
  allScroll.forEach((scroll, idx) => {
    let eleScroll = scroll.getBoundingClientRect().top;
    if (eleScroll <= window.innerHeight) {
      setTimeout(() => {
        scroll.classList.remove("scroll");
      }, idx * 200);
    }
  });
}

function handleMsg() {
  let emptyTablePar = document.querySelector(".table-p");

  if (tableLen == 0) {
    emptyTablePar.classList.add("hidden");
  } else {
    emptyTablePar.classList.remove("hidden");
  }
}

window.addEventListener("load", handelScroll);

window.addEventListener("scroll", handelScroll);

function addElement(i, tableTitles) {
  let ul = document.createElement("ul");
    
  ul.className = classTreats;
  
  if (i % 2 != 0) {
    ul.classList.add("bg-gray-100");
  }

    let flagForLi = false;

    if (lst[i]["treat"] == "صــرف" ) {
      flagForLi = true;
    }

    for (let j = 0; j < 5; j++) {
      let li = document.createElement("li");
      if (lst[i][lstIds[j]] == "") {
        li.textContent = "لا يوجد";
      } else if (Number(lst[i][lstIds[j]])) {
        li.textContent = lst[i][lstIds[j]] + " جنيه";
      }
      else {
        li.textContent = lst[i][lstIds[j]];
      }

      if (flagForLi) {
        li.classList.add("output");
      } else {
        li.classList.add("input");
      }

      ul.append(li);

  }

  let editLi = document.createElement("li");

  editLi.classList.add("flex", "justify-center", "md:gap-5", "gap-2");

  let editicon = document.createElement("i");

  editicon.classList.add("fa-solid", "fa-pen");

  editicon.addEventListener("click", (e) => {
    let popBox = document.querySelector(".pop-box");
    popBox.style.display = "block";
    let pressed = false;
    let startX, startY, posX, posY;


    popBox.addEventListener("mousedown", (e) => {
      pressed = true;
      startX = e.clientX;
      posX = popBox.offsetLeft;

      startY = e.clientY;
      posY = popBox.offsetTop;

      popBox.style.cursor = "grabbing";
      document.body.style.userSelect =  "none";
    });

    document.addEventListener("mouseup", () => {
      pressed = false;
      popBox.style.cursor = "grab"
      document.body.style.userSelect =  "auto";
    })

    document.addEventListener("mousemove", (e) => {
      if (!pressed) return
      let x = startX - e.clientX;
      let y = startY - e.clientY;

      popBox.style.left = `${posX - x}px`;
      popBox.style.top = `${posY - y}px`;

      }
    )

    popBox.addEventListener("touchstart", (e) => {
      pressed = true;
      startX = e.touches[0].clientX;
      posX = popBox.offsetLeft;

      startY = e.touches[0].clientY;
      posY = popBox.offsetTop;
      document.body.style.userSelect =  "none";
    });

    document.addEventListener("touchend", () => {
      pressed = false;
      document.body.style.userSelect =  "auto";
    })

    document.addEventListener("touchmove", (e) => {
      if (!pressed) return;
      let x = startX - e.touches[0].clientX;
      let y = startY - e.touches[0].clientY;

      popBox.style.left = `${posX - x}px`;
      popBox.style.top = `${posY - y}px`;

      }
    )

    function closePopBox() {
      targetEle.classList.remove("target");
      popBox.style.display = "none";
    }

    let closeBtn = document.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      closePopBox();
    })

    let targetEle = e.target.parentElement.parentElement;
    targetEle.classList.add("target");

    let editBtn = document.querySelector(".sub-btn");
    editBtn.addEventListener("click", () => {
      let inputs = document.querySelectorAll(".pop-box input");
      let lstEle = targetEle.children;
      let activeBtn = document.querySelector(".btn.active");

      //add popBox inputs content
      for (let j = 3; j > -1; j--) {
        if (j >= 2) {
          if (j == 2) {
            lstEle[j].textContent = activeBtn.textContent;
          }
          lstEle[j + 1].textContent = inputs[j].value;
          if (j == 3) {
            lstEle[j + 1].textContent = inputs[j].value + " جنيه";
          }
        } else {
          lstEle[j].textContent = inputs[j].value;
        }
      }

      // after add content of popBox
      closePopBox();

      let idx = Array.from(tableTitles.children).indexOf(targetEle);
      let type = activeBtn.textContent;
      lst[idx - 2]["treat"] = type;
      let j = 0;

      // update lst after edit
      for (let key in lst[idx - 2]) {
        if (key != "treat") {
          if (j >= 3) {
            lst[idx - 2][key] = lstEle[j].textContent;
          } else {
            lst[idx - 2][key] = lstEle[j - 1].textContent;
          }
        }
        j++;
      }
      localStorage.setItem("wallet", JSON.stringify(lst));
    })
  })


  let delIcon = document.createElement("i");

  delIcon.classList.add("fa-solid", "fa-trash", "output");

  delIcon.addEventListener("click", (e) => {
    let targetEle = e.target.parentElement.parentElement;
    targetEle.classList.add("target");
    let idx = Array.from(tableTitles.children).indexOf(targetEle);
    lst = lst.filter((item, index) => index !== idx - 2); // update lst without deleted item
    localStorage.setItem("wallet", JSON.stringify(lst))
    targetEle.classList.add("scroll");
    setTimeout(() => {
      targetEle.remove();
    }, 200);
    handleMsg();
  })

  if (document.location.pathname == "/history.html") {
    editLi.append(editicon, delIcon);
    ul.classList.remove("grid-cols-5");
    ul.classList.add("grid-cols-6")
  }

  ul.append(editLi);

  tableTitles.append(ul);
}


if (document.location.pathname == "/index.html") {
  let headers = document.querySelectorAll("h3");

  let tableTitles = document.querySelector("ul.table-titles").parentElement;

  let totalIncomes = 0;
  let totalCosts = 0;

  lst.forEach((op) => {
    if (op["treat"] === "دخــل") {
      totalIncomes += parseInt(op["amount"]);
    } else {
      totalCosts += parseInt(op["amount"]);
    }
  })


  headers[0].textContent = `${totalIncomes} جنيه`;
  headers[1].textContent = `${totalCosts} جنيه`;
  headers[2].textContent = `${totalIncomes - totalCosts} جنيه`;

  let p = document.querySelector(".table-p");


  if (lst.length == 0) {
    p.classList.remove("hidden");
  } else {
    p.classList.add("hidden");

    if (lst.length < 5) {
      counter = 0;
    } else {
      counter = lst.length - 5;
    }

    for (let i = lst.length - 1; i > counter - 1; i--){
      addElement(i, tableTitles);
    }
  }

}

let flag = false;

// handle menuBtn for phone view
btnToggle.addEventListener("click", () => {
  if (flag) {
    flag = false;
    mobileMenu.classList.remove("appear-menu");
    mobileMenu.classList.add("hidden-menu");
    setTimeout(() => {
      mobileMenu.setAttribute("hidden", "");
    }, 300);
  } else {
    flag = true;
    mobileMenu.removeAttribute("hidden");
    setTimeout(() => {
      mobileMenu.classList.remove("hidden-menu");
      mobileMenu.classList.add("appear-menu");
    }, 300)
  }
});


if (document.location.pathname == "/input.html") {

  let dateInput = document.getElementById("date");

  dateInput.value = `${date}`;

  let inputs = document.querySelectorAll("input");

  let saveBtn = document.querySelector(".sub-btn");

    saveBtn.addEventListener("click", () => {

      let treatming = {
        "treat": "",
        "date": "",
        "descreption" : "",
        "category": "",
        "amount": ""
      }

      treatming["treat"] = document.querySelector(".active").textContent;
      inputs.forEach((input, index) => {
        treatming[input.id] = input.value;
      });

      lst.push(treatming);
      localStorage.setItem("wallet", JSON.stringify(lst));

      inputs.forEach((input) => {
        if (input.id != "date") {
          input.value = "";
        }
      })

      let msg = document.querySelector(".msg");

      msg.classList.remove("hidden");

      setTimeout(() => {
        msg.classList.add("hidden");
      }, 500);
  });
}

let dateIpts = document.querySelectorAll("input[type = 'date']");

  dateIpts.forEach((ipt) => {
    ipt.value = `${date}`;

    ipt.max = `${date}`;

    ipt.onclick = () => {
      ipt.showPicker();
    }
  })

  
if (document.location.pathname == "/history.html") {

    dateIpts[0].addEventListener("input", () => {
        dateIpts[1].min = dateIpts[0].value;
      })

  let tableTitles = document.querySelector("ul.table-titles").parentElement;

  let p = document.querySelector(".table-p");


  if (lst.length == 0) {
    p.classList.remove("hidden");
  } else {
    p.classList.add("hidden");

    for (let i = 0; i < lst.length; i++){
      addElement(i, tableTitles);
    }
  }

  const selected = document.querySelector(".selected");

  selected.textContent = "كل الأصناف";

  const options = document.querySelector(".options");

  let optionsLst = [];


  lst.forEach((treat) => {
    if (!(optionsLst.includes(treat["category"]))) {
      optionsLst.push(treat["category"]);
      let optEle = document.createElement("div");
      optEle.textContent = treat["category"];
      options.append(optEle);
    }
  })

  let selFlag = false;

  selected.onclick = () => {
    if (selFlag) {
      selected.style.borderColor = "#eee";
      selFlag = false;
    } else {
      selected.style.borderColor = "var(--altMainColor)";
      selFlag = true;
    }
    options.style.display = options.style.display === "block" ? "none" : "block";
  };

  options.querySelectorAll("div").forEach(opt => {
    opt.onclick = () => {
      selected.textContent = opt.textContent;
      options.style.display = "none";
    };
  });

  let btn = document.querySelector(".btn");

  function addSearchEle(date, table, idx) {
    date.style.display = "grid"
    setTimeout(() => {
      date.classList.remove("scroll");
    }, 200 * idx);
  }

  let lstDates = document.querySelectorAll(".table-content");

  btn.onclick = () => {
    let firstDate = new Date(dateIpts[0].value);
    let endDate = new Date(dateIpts[1].value);
    let sel = selected.textContent;

    let boxTable = document.querySelector(".heading + .box");


    lstDates.forEach((date, idx) => {
      if (!(firstDate <= new Date(lst[idx]["date"]) && endDate >= new Date(lst[idx]["date"]) && (sel === lst[idx]["category"] || sel === "كل الأصناف"))) {
        date.classList.add("scroll");
        setTimeout(() => {
          date.style.display = "none";
        }, 200);
      } else {
        addSearchEle(date, boxTable, idx);
      }
    });

    setTimeout(() => {
      let pFlag = document.querySelectorAll(".table-content.scroll");
      if (pFlag.length != 0) {
        p.classList.remove("hidden");
      } else {
        p.classList.add("hidden");
      }
    }, 200)

  }
}