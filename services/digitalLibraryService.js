class DigitalLibraryService {

    constructor() {
        this.digitalContent = new Map()
    }

    async processEbook(file) {
        const metadata = await this.extractMetadata(file);
        const formats = await this.generateFormats(file);

        const digitalAsset = new DigitalAsset({
            title: metadata.title,
            author: metadata.author,
            formats,
            isbn: metadata.isbn,
            drm: await this.applyDRM(file),
            accessLevel: metadata.accessLevel || 'public'
        });

        await digitalAsset.save();
        return digitalAsset;
    }

    async streamContent(assetId, userId, format) {
        const asset = await DigitalAsset.findById(assetId);
        const userAccess = await this.verifyAccess(userId, asset);

        if (userAccess.granted) {
            const streamUrl = await this.generateSignedUrl(asset.formats[format]);
            await this.logAccess(userId, assetId);
            return streamUrl;
        }

        throw new Error('Access denied');
    }

    async initialize() {
        // Initialize digital content storage
        console.log('Digital Library Service initialized')
    }

    async addContent(content) {
        const contentId = Date.now().toString()
        this.digitalContent.set(contentId, {
            id: contentId,
            ...content,
            uploadedAt: new Date()
        })
        return contentId
    }

    async getContent(id) {
        return this.digitalContent.get(id)
    }

    async getAllContent() {
        return Array.from(this.digitalContent.values())
    }

    async updateContent(id, updates) {
        const content = this.digitalContent.get(id)
        if (!content) throw new Error('Content not found')

        this.digitalContent.set(id, {
            ...content,
            ...updates,
            updatedAt: new Date()
        })
        return this.digitalContent.get(id)
    }

    async deleteContent(id) {
        return this.digitalContent.delete(id)
    }

    async searchContent(query) {
        const results = Array.from(this.digitalContent.values()).filter(content =>
            content.title.toLowerCase().includes(query.toLowerCase()) ||
            content.description.toLowerCase().includes(query.toLowerCase())
        )
        return results
    }
}



module.exports = DigitalLibraryService