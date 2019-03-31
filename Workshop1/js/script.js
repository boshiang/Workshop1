var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];
// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
};

//清除localstorage
$("#clear_localstorage").click(function () {
    localStorage.clear(); //clear the local storage
    alert("Local storage is cleared. Please reload the page!");
});

function Dogrid() {
    kendo.culture("zh-TW");
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type: "number"},
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
        toolbar: [
            { template: kendo.template($("#template").html()) }
        ],
        columns: [
            {
                command: [{
                    text: "刪除",
                    click: DeleteDetails
                }],
                width: 100
            },
            {
                field: "BookId",
                title: "書籍<br>編號",
                width: 80
            }, {
                field: "BookName",
                title: "書籍<br>名稱",
                width: 200
            }, {
                field: "BookCategory",
                title: "書籍<br>種類",
                width: 100
            }, {
                field: "BookAuthor",
                title: "作者",
                width: 150
            }, {
                field: "BookBoughtDate",
                title: "購買<br>日期",
                format: "{0: yyyy-MM-dd}",
                width: 150
            }, {
                field: "BookDeliveredDate",
                title: "送達<br>狀態",
                template: "#if(BookDeliveredDate != null){#<i class='fas fa-truck' id='icon' onmouseover='Domouseover(this)'></i>#}#",
                width: 100
            }, {
                field: "BookPrice",
                title: "金額",
                attributes: {
                    style: "text-align: right"
                },
                width: 100
            }, {
                field: "BookAmount",
                title: "數量",
                attributes: {
                    style: "text-align: right"
                },
                width: 100
            }, {
                field: "BookTotal",
                title: "總計",
                format: "{0:n0}元",
                width: 100
            }]
    });
    //尋找過濾條件{書籍名稱} {作者}
    $("#searchBox").keyup(function () {
        var searchValue = $('#searchBox').val();
        $("#book_grid").data("kendoGrid").dataSource.filter({
            logic: "or",
            filters: [
                {
                    field: "BookName",
                    operator: "contains",
                    value: searchValue
                },
                {
                    field: "BookAuthor",
                    operator: "contains",
                    value: searchValue
                }
            ]
        });
    });
};
//Icon 滑鼠移過事件
function Domouseover(e) {
    var dataSource = $("#book_grid").data("kendoGrid");
    var dataItem = dataSource.dataItem($(e).closest("tr"));
    $("#book_grid").kendoTooltip({
        filter: "i",
        animation: false,
        content: function (e) {
            return dataItem.BookDeliveredDate;
        }
    });
    console.log(dataItem.BookDeliveredDate);
};
//書籍種類翻譯
function Translate() {
    for (var i = 0; i < bookDataFromLocalStorage.length; i++) {
        for (var j = 0; j < bookCategoryList.length; j++) {
            if (bookDataFromLocalStorage[i].BookCategory == bookCategoryList[j].value ) {
                bookDataFromLocalStorage[i].BookCategory = bookCategoryList[j].text;
            }
        }
    }
};
//刪除
function DeleteDetails(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.target).closest("tr"));
    var dataSource = $("#book_grid").data("kendoGrid").dataSource;
    kendo.confirm("確定刪除「" + dataItem.BookName + "」 嗎?").then(function () {
        dataSource.remove(dataItem);
        var delete_json = localStorage.getItem("bookData");
        var delete_jsonObj = JSON.parse(delete_json); //obj
        for (var i = 0; i < delete_jsonObj.length; i++) {
            if (delete_jsonObj[i].BookId == dataItem.BookId) {
                delete_jsonObj.splice(i, 1);
                break;
            }
        }
        bookDataFromLocalStorage = JSON.stringify(delete_jsonObj);
        localStorage.setItem("bookData", bookDataFromLocalStorage);
    });
};
//送達日期不得早於出貨日期
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
//新增書籍介面
function Insert() {
    //document.getElementById("book_form").reset();
    //驗證;
    var validatable = $("#book_form").kendoValidator().data("kendoValidator");
    //select option value change img
    $("#book_category").kendoDropDownList({
        dataSource: bookCategoryList,
        dataTextField: 'text',
        dataValueField: 'value',
        change: function (e) {
            var get_value = $("#book_category").val();
            console.log(get_value);
            for (var x = 0; x < bookCategoryList.length; x++) {
                if (get_value == bookCategoryList[x]["value"]) {
                    var img_src = bookCategoryList[x]["src"];
                    $(".book-image").attr("src", img_src);
                }
            }
        }
    });
    //$("#book_name").kendoMaskedTextBox();
    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy/MM/dd", "yyyyMMdd", "yyyy-MM-dd"]
    });
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
                var total_str = parseInt(price) * parseInt(amount);
                var total = moneyFormat(total_str.toString());
                document.getElementById("book_total").innerHTML = total;
            } else {
                document.getElementById("book_total").innerHTML = 0;
            }
        }
    });

    $("#add_book").click(function () {
        document.getElementById("book_form").reset();
        $("#bought_datepicker").kendoDatePicker({
            value: new Date(),
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy/MM/dd", "yyyyMMdd", "yyyy-MM-dd"]
        });
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
        Check_date();  
        $("#add_book").fadeOut();
    });
    Insert_Data();
}
//新增書籍資料
function Insert_Data() {
    $("#save_book").click(function () {
        var validator = $("#book_form").data("kendoValidator");
        var book_name = $("#book_name").val();
        for (var i = 0; i < bookCategoryList.length; i++) {
            if ($("#book_category").val() == bookCategoryList[i].value) {
                var book_category = bookCategoryList[i].text;
                break;
            }
        }
       
        var book_author = $("#book_author").val();
        if ($("#bought_datepicker").val() == "") {
            var bought_datepicker = ""
        } else {
            var bought_datepicker = $("#bought_datepicker").val();
        }
        if ($("#delivered_datepicker").val() == '') {
            var delivered_datepicker = null;
        } else {
            var delivered_datepicker = $("#delivered_datepicker").val();
        }
        var book_price = $("#book_price").val();
        var book_amount = $("#book_amount").val();
        var book_total = parseInt(book_price) * parseInt(book_amount);
        if (validator.validate()) {
            var data = $("#book_grid").data("kendoGrid").dataSource;
            var insert_json = localStorage.getItem("bookData");
            var insert_jsonObj = JSON.parse(insert_json); //obj
            var book_id = Object.keys(bookDataFromLocalStorage).map(function (_) { return bookDataFromLocalStorage[_]; });
            //console.log(bookDataFromLocalStorage[book_id.length-1].BookId);
            var data_add = data.add({
                //BookId: book_id.length+1,
                BookName: book_name,
                BookCategory: book_category,
                BookAuthor: book_author,
                BookBoughtDate: bought_datepicker,
                BookDeliveredDate: delivered_datepicker,
                BookPrice: book_price,
                BookAmount: book_amount,
                BookTotal: book_total
            });
            data.sync();
            //save to localstorage
            insert_jsonObj.push(data_add);
            bookDataFromLocalStorage = JSON.stringify(insert_jsonObj);
            localStorage.setItem("bookData", bookDataFromLocalStorage);
            //console.log(bookDataFromLocalStorage);
            alert("新增成功");
            var popup = $("#window").data('kendoWindow');
            popup.close();
        } else {
            alert('新增失敗');
            var popup = $("#window").data('kendoWindow');
            popup.close();
        }
        document.getElementById("book_form").reset();
        document.getElementById("book_total").innerHTML = 0;
    });
}
//總計金額三位一撇
function moneyFormat(str) {
    if (str.length <= 3) {
        return str;
    } else {
        return moneyFormat(str.substr(0, str.length - 3)) + "," + (str.substr(str.length - 3));
    }
} 
//計算總計金額
function Total() {
    var price = $("#book_price").val();
    var amount = $("#book_amount").val();
    var total = parseInt(price) * parseInt(amount);
    document.getElementById("book_total").innerHTML = total;
}

$(function () {
    loadBookData();
    Translate();
    Insert();
    Dogrid();
});