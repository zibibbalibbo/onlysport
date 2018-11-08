var SponsorPage = {
    init: function () {
        let rowSizeClasses = [null, 'uno', 'due', 'tre', 'quattro'];
        let wrapper = $('#sponsors');
        $.get({
            url: "/data/sponsor.json",
            dataType: 'json'
        }).then((data) => {
            for (let r in data) {
                let row = data[r];

                let rowClass = rowSizeClasses[row.length];
                let rowHtml = `<div class="sponsor-row ${rowClass}">`;

                for (let s in row) {
                    let sp = row[s];
                    rowHtml += `<a class="sponsor-el" href="${sp.url}"><img src="/img/loghi/${sp.image}" alt="${sp.name}"></a>`;
                }

                rowHtml += '</div>';
                wrapper.append(rowHtml);
            }
        }, () => {
            console.log('errore');
        });
    }
}

$(document).ready(function () {
    SponsorPage.init();
});