$(() => {
    let form = $('#scrapperForm');
    form.submit(( event )=>{
        console.info(form.serialize());
        event.preventDefault();
        $('#errors').hide()
        $.ajax({
            url: '/api/search/',
            method: 'GET',
            data: form.serialize()
        }).done(function (response) {
            console.info(response)
            $.get('result.jade').then(function(doc) {
                var html = jade.compile(doc);
                var result = html(response);

                $('#results').append( result )
            });
        }).fail(function (response) {
            console.info(response)
            $.get('response_error.jade').then(function(doc) {
                var html = jade.compile(doc);
                var result = html(response);
                $('#errors').show().append( result )
            });

        });
    });

});