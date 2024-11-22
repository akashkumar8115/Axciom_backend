const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

class ChatbotService {
    constructor() {
        this.classifier = new natural.BayesClassifier();
        this.trainClassifier();
    }

    trainClassifier() {
        this.classifier.addDocument('where is my book', 'book_location');
        this.classifier.addDocument('when is my book due', 'due_date');
        this.classifier.addDocument('how do I renew', 'renewal');
        this.classifier.addDocument('what are the library hours', 'hours');
        this.classifier.train();
    }

    async processQuery(query) {
        const intent = this.classifier.classify(query);
        return await this.generateResponse(intent, query);
    }

    async generateResponse(intent, query) {
        const responses = {
            book_location: async () => {
                const book = await this.findBookFromQuery(query);
                return book ? `The book is located at shelf ${book.location}` : 'Book not found';
            },
            due_date: async () => {
                const loans = await this.getUserActiveLoans(query);
                return loans.map(loan => `${loan.book.title}: ${loan.dueDate}`).join('\n');
            }
        };
        return responses[intent] ? await responses[intent]() : 'I cannot help with that';
    }
}
