var sort = 12;
var page = Number(document.querySelector('#currentPage').value);
var perPage = Number(document.getElementById('perPage').value);

function showDebtor(data, count, page) {
    document.querySelector('#cards').innerHTML = '';
    if (!data.length) {
        document.querySelector('#cards').innerHTML = '<h3>Chưa có người nợ nào được tạo!</h3>';
    };
    for (let [index, { fullname, createAt, updateAt, email, phone, address, totalDebts, slug }] of data.entries()) {
        createAt = dateTimeHelper(createAt);
        updateAt = dateTimeHelper(updateAt);
        totalDebts = formatMonney(totalDebts);
        let card = `<div class="col-sm-6 col-lg-4">
                    <div class="card card-link">
                    <a href="debt/${slug}">
                        <div class="card-body">
                        <h5 class="card-title">${index + 1}. ${fullname}</h5>
                        <div class="row">
                            <div class="col-sm-4 card-text">Ngày tạo:</div>
                            <div class="col-sm-8 card-text">${createAt}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4 card-text">Cập nhật:</div>
                            <div class="col-sm-8 card-text">${updateAt}</div>
                        </div>
                        </div>
                        <div class="card-body card-body-hover">
                        <h5 class="card-title">${index + 1}. ${fullname}</h5>
                        <div class="row">
                            <div class="col-sm-3 card-text">SĐT:</div>
                            <div class="col-sm-9 card-text">${phone}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-3 card-text">Email:</div>
                            <div class="col-sm-9 card-text">${email}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-3 card-text">Địa chỉ:</div>
                            <div class="col-sm-9 card-text">${address}</div>
                        </div>
                        </div>
                        <div class="card-footer">
                        <h5>Tổng nợ:</h5>
                        <h5>${totalDebts}</h5>
                        </div>
                    </a>
                    </div>
                </div>`
        document.querySelector('#cards').innerHTML = document.querySelector('#cards').innerHTML + card;
    };
    formatPage(count, page);
};

function getFilterDebtor() {
    const name = document.querySelector('#nameFilter').value;
    const address = document.querySelector('#addressFilter').value;
    const phone = document.querySelector('#phoneFilter').value;
    const email = document.querySelector('#emailFilter').value;
    const minMonney = document.querySelector('#minMonney').value;
    const maxMonney = document.querySelector('#maxMonney').value;
    const minUpdateAt = document.querySelector('#minUpdateAt').value;
    const maxUpdateAt = document.querySelector('#maxUpdateAt').value;
    const minCreateAt = document.querySelector('#minCreateAt').value;
    const maxCreateAt = document.querySelector('#maxCreateAt').value;
    return { name, address, phone, email, minMonney, maxMonney, minCreateAt, maxCreateAt, minUpdateAt, maxUpdateAt };
};

function debtor() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debtor/show`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebtor(data, count, page);
        };
    };
    xhr.send();
};

function filterDebtor(page, sort) {
    let { name, address, phone, email, minMonney, maxMonney, minCreateAt, maxCreateAt, minUpdateAt, maxUpdateAt } = getFilterDebtor();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debtor/show/?name=${name}&address=${address}&phone=${phone}&email=${email}&minMonney=${minMonney}&maxMonney=${maxMonney}&minCreateAt=${minCreateAt}&maxCreateAt=${maxCreateAt}&minUpdateAt=${minUpdateAt}&maxUpdateAt=${maxUpdateAt}&perPage=${perPage}&page=${page}&sort=${sort}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebtor(data, count, page);
        };
    };
    xhr.send();
};

function handleFilterDebtor() {
    filterDebtor(1, sort);
};

function clearFilterDebtor() {
    document.querySelector('#nameFilter').value = '';
    document.querySelector('#addressFilter').value = '';
    document.querySelector('#phoneFilter').value = '';
    document.querySelector('#emailFilter').value = '';
    document.querySelector('#minMonney').value = '';
    document.querySelector('#maxMonney').value = '';
    document.querySelector('#minUpdateAt').value = '';
    document.querySelector('#maxUpdateAt').value = '';
    document.querySelector('#minCreateAt').value = '';
    document.querySelector('#maxCreateAt').value = '';
    filterDebtor(1, sort);
};

function prevPageDebtor() {
    let page = prevPage();
    filterDebtor(page, sort);
};

function nextPageDebtor() {
    let page = nextPage();
    filterDebtor(page, sort);
};

function choosePageDebtor() {
    let page = choosePage();
    filterDebtor(page, sort);
};

function sortByNameAsc() {
    sort = 1;
    filterDebtor(page, sort);
};

function sortByNameDesc() {
    sort = 2;
    filterDebtor(page, sort);
};

function sortByAddressAsc() {
    sort = 3;
    filterDebtor(page, sort);
};

function sortByAddressDesc() {
    sort = 4;
    filterDebtor(page, sort);
};

function sortByPhoneAsc() {
    sort = 5;
    filterDebtor(page, sort);
};

function sortByPhoneDesc() {
    sort = 6;
    filterDebtor(page, sort);
};

function sortByEmailAsc() {
    sort = 7;
    filterDebtor(page, sort);
};

function sortByEmailDesc() {
    sort = 8;
    filterDebtor(page, sort);
};

function sortByTotalDebtsAsc() {
    sort = 9;
    filterDebtor(page, sort);
};

function sortByTotalDebtsDesc() {
    sort = 10;
    filterDebtor(page, sort);
};

function sortByCreateAtAsc() {
    sort = 11;
    filterDebtor(page, sort);
};

function sortByCreateAtDesc() {
    sort = 12;
    filterDebtor(page, sort);
};

function sortByUpdateAtAsc() {
    sort = 13;
    filterDebtor(page, sort);
};

function sortByUpdateAtDesc() {
    sort = 14;
    filterDebtor(page, sort);
};

function addDebtor() {
    const fullname = document.querySelector('#fullname').value;
    const phone = document.querySelector('#phone').value;
    const address = document.querySelector('#address').value;
    const email = document.querySelector('#email').value;

    const data = { fullname, phone, address, email };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/finance/debtor/add/?page=${page}&perPage=${perPage}&sort=${sort}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Thêm thông tin người nợ thành công!');
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebtor(data, count, page);
        };
    };
    xhr.send(JSON.stringify(data));
};