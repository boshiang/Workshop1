var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];
$(document).ready(function () {
    Translate();
    Insert();
    Dogrid();
})
function Dogrid() {
    kendo.culture("zh-TW");
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookData,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "number" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "date" },
                        BookDeliveredDate: { type: "string" },
                        BookPrice: { type: "number" },
                        BookAmount: { type: "number" },
                        BookTotal: { type: "number" }
                    }
                }
            },
            pageSize: 20
        },
        height: 550,
        groupable: false, // title
        sortable: true, // 排序
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            {
                command: [{
                    text: "刪除",
                    click: DeleteDetails
                }]
            },
            {
                field: "BookId",
                title: "書籍編號"
            }, {
                field: "BookName",
                title: "書籍名稱"
            }, {
                field: "BookCategory",
                title: "書籍種類"
            }, {
                field: "BookAuthor",
                title: "作者"
            }, {
                field: "BookBoughtDate",
                title: "購買日期",
                format: "{0: yyyy-MM-dd}"
            }, {
                field: "BookDeliveredDate",
                title: "送達狀態",
                template: "#if(BookDeliveredDate != null){#<i class='fas fa-ambulance' id='icon' onmouseover='Domouseover(this)'></i>#}#"
            }, {
                field: "BookPrice",
                title: "金額",
                attributes: {
                    style: "text-align: right"
                }
            }, {
                field: "BookAmount",
                title: "數量",
                attributes: {
                    style: "text-align: right"
                }
            }, {
                field: "BookTotal",
                title: "總計",
                format: "{0:n0}元"
            }]
    });
};

function Domouseover(e) {
    var dataSource = $("#book_grid").data("kendoGrid");
    var dataItem = dataSource.dataItem($(e).closest("tr"));
    $("i").kendoTooltip({
        animation: false,
        content: function (e) {
            return dataItem.BookDeliveredDate;
        }
    });
    console.log(dataItem.BookDeliveredDate);
};
function Translate() {
    for (var i = 0; i < bookData.length; i++) {
        for (var j = 0; j < bookCategoryList.length; j++) {
            if (bookData[i].BookCategory == bookCategoryList[j].value ) {
                bookData[i].BookCategory = bookCategoryList[j].text;
            }
        }
    }
};
//Delete row
function DeleteDetails(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.target).closest("tr"));
    var dataSource = $("#book_grid").data("kendoGrid").dataSource;
    kendo.confirm("確定刪除「" + dataItem.BookName + "」 嗎?").then(function () {
        dataSource.remove(dataItem);
    });
};
//
function Check_date() {
    var container = $("#book_form");
    kendo.init(container);
    container.kendoValidator({
        rules: {
            greaterdate: function (input) {
                //console.log(input.val());
                if (input.is("[data-greaterdate-msg]") && input.val() != "") {
                    var date = kendo.parseDate(input.val()),
                        otherDate = kendo.parseDate($("[name='" + input.data("greaterdateField") + "']").val());
                    //console.log(input.val());
                    return otherDate == null || otherDate.getTime() < date.getTime();
                }
                return true;
            }
        }
    });
}
//insert data
function Insert() {
    //Validator();
    var validatable = $("#book_form").kendoValidator().data("kendoValidator");
    var book_category = document.getElementById("book_category");
    for (var i = 0; i < bookCategoryList.length; i++) {
        var book_category_opt = document.createElement('option');
        book_category_opt.appendChild(document.createTextNode(bookCategoryList[i].text));
        book_category_opt.value = bookCategoryList[i].value; 
        book_category.appendChild(book_category_opt);
    }

    $("#add_book").click(function () {
        $("#window").kendoWindow({
            width: "500px",
            title: "新增書籍",
            visible: false,
            modal: true,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            close: onClose
        });
        var popup = $("#window").data('kendoWindow');
        popup.open();
        popup.center();
        function onClose() {
            $("#add_book").fadeIn();
        }
        //select option value change img
        $("#book_category").kendoDropDownList({
            change: function (e) {
                var get_value = $("#book_category").val();
                console.log(get_value);
                for (var x = 0; x < bookCategoryList.length; x++) {
                    if (get_value == bookCategoryList[x]["value"]) {
                        var img_src = bookCategoryList[x]["src"];
                        $(".book-image").attr("src",img_src);
                    }
                }
            }
        });
        Check_date();
        //$("#book_name").kendoMaskedTextBox();
        $("#bought_datepicker").kendoDatePicker({
            value: new Date(),
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy/MM/dd", "yyyyMMdd", "yyyy-MM-dd"]
        });
        $("#add_book").fadeOut();
        $("#delivered_datepicker").kendoDatePicker({
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy/MM/dd", "yyyyMMdd", "yyyy-MM-dd"]
        });

        
        $("#book_price,#book_amount").kendoNumericTextBox({
            decimals: 0,
            format: "{0:n0}",
            min: 0,
            change: function () {
                var price = $("#book_price").val();
                var amount = $("#book_amount").val();
                if (price != "" && amount != "") {
                    var total = parseInt(price) * parseInt(amount);
                    document.getElementById("book_total").innerHTML = total;
                } else {
                    document.getElementById("book_total").innerHTML = 0;
                }
                
            }
        });
        

        /*$("#save_book").click(function () {
            var validator = $("#book_form").data("kendoValidator");
            if (validator.validate()) {
                alert("Employee Saved");
            }
        });*/
        
    });
}
function Total() {
    var price = $("#book_price").val();
    var amount = $("#book_amount").val();
    var total = parseInt(price) * parseInt(amount);
    console.log(total); //value is the selected date in the numerictextbox
    document.getElementById("book_total").innerHTML = total;
}
// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
};



$(function () {
    loadBookData();
});