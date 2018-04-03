let expect = require('expect');
let {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = "Jen";
        let text = "Some msg";
        let message = generateMessage(from, text);
        
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text });
    });
});

describe('generateLocation', () => {
    it('should generate correct location object', () => {
        let from = "Mac";
        let lon = 21;
        let lat = 11;
        let location = generateLocationMessage(from, lon, lat);
        let url = `https://www.google.pl/maps?q=${lon},${lat}`;
        
        expect(location.createdAt).toBeA('number');
        expect(location).toInclude({from, url})
    });
});