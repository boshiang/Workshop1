var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];
function translate() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    for (var i = 0; i < bookDataFromLocalStorage.length; i++) {
        for (var j = 0; j < bookCategoryList.length; j++) {
            if (bookDataFromLocalStorage[i].BookCategory == bookCategoryList[j].value ) {
                bookDataFromLocalStorage[i].BookCategory = bookCategoryList[j].text;
            }
        }
        if (bookDataFromLocalStorage[i].hasOwnProperty("BookDeliveredDate")) {
            console.log(bookDataFromLocalStorage[i].BookDeliveredDate);
            // bookDataFromLocalStorage[i].BookDeliveredDate.show();
        }
    }
};

function DeleteDetails(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.target).closest("tr"));
    var dataSource = $("#book_grid").data("kendoGrid").dataSource;
    kendo.confirm("確定刪除「" + dataItem.BookName + "」 嗎?").then(function () {
        dataSource.remove(dataItem);
    });
};
// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    } else {
        translate();
        //console.log(bookDataFromLocalStorage.length);
        /*$("#products").kendoMultiSelect({
            placeholder: "Select products...",
            dataTextField: "BookName",
            dataValueField: "BookAuthor",
            autoBind: true,
            dataSource: {
                data: bookData
            }
        });*/
        kendo.culture("zh-TW");
        $("#book_grid").kendoGrid({
            dataSource: {
                data: bookDataFromLocalStorage,
                schema: {
                    model: {
                        fields: {
                            BookId: { type: "number" },
                            BookName: { type: "string" },
                            BookCategory: { type: "string" },
                            BookAuthor: { type: "string" },
                            BookBoughtDate: { type: "date" },
                            BookDeliveredDate: { type: "string"}, 
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
                    template: "#if(BookDeliveredDate != null){#<i class='fas fa-ambulance'></i>#}#"
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
};



$(function () {
    loadBookData();
});