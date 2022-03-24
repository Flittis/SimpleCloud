export let GenerateToken = (length) => {
    var Output = '', Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) 
        Output += Characters.charAt( Math.floor( Math.random() * Characters.length ));
    
    return Output;
}