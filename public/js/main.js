$(document).ready(() => {
    $('.delete-todo').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr("data-id");
        console.log(id);

        var url = '/todo/delete/' + id;

        $.ajax({
            type: "DELETE",
            url: url,
            success: function (response) {
                alert('Deleting todo ');
                window.location.href = '/';
            },
            error: (err) => {
                console.error(err);
            }
        });
    })
});