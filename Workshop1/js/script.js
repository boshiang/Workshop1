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
    } else {
        //console.log(bookDataFromLocalStorage.length);
        $("#products").kendoMultiSelect({
            placeholder: "Select products...",
            dataTextField: "BookName",
            dataValueField: "BookAuthor",
            autoBind: true,
            dataSource: {
                data: bookData
            }
        });
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
                            BookDeliveredDate: { type: "boolean" },
                            BookPrice: { type: "number" },
                            BookAmount: { type: "number" },
                            BookTotal: { type: "number" }
                        }
                    }
                },
                serverPaging: true,
                serverFiltering: true,
                pageSize: 20
            },
            height: 550,
            groupable: false, // title
            sortable: true, // 排序
            pageable: {
                input: true,
                numeric: false,
                //refresh: false,
                //pageSizes: false, // 下方按鈕
                //buttonCount: 5,
            },
            columns: [
                {
                    field: "BookId",
                    title: "書籍編號",
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
                    title: "送達狀態"
                }, {
                    field: "BookPrice",
                    title: "金額"
                }, {
                    field: "BookAmount",
                    title: "數量"
                }, {
                    field: "BookTotal",
                    title: "總計",
                    format: "{0:n0}元"
                }]
        });
    }
}

$(function () {
    loadBookData();
});