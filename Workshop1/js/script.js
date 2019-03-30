var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];
/*$("#autocomplete").kendoAutoComplete({
    placeholder: "我想要找...",
    filter: "contains",
    dataSource: {
        data: bookData
    },
    dataTextField: "BookName",
    template: '<span>#: BookName #    #: BookAuthor #</span>',
    select: onSelect
});*/

function Dogrid() {
    kendo.culture("zh-TW");
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookData,
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

    $('#autocomplete').on('input', function (e) {
        //console.log(e);
        var grid = $('#book_grid').data('kendoGrid');
        var columns = grid.columns;
        var filter = { logic: 'or', filters: [] };
        //console.log(e.currentTarget.value);
        columns.forEach(function (x) {
            //console.log(x);
            if (x.field) {
                var type = grid.dataSource.options.schema.model.fields[x.field].type;
                if (type == 'string') {
                    filter.filters.push({
                        field: x.field,
                        operator: 'contains',
                        value: e.target.value
                    })
                }
            }
        });
        grid.dataSource.filter(filter);
    });

};

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
    Translate();
    Insert();
    Dogrid();
});