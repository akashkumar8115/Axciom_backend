class ContentManagementService {
    async createContent(data) {
        const content = new Content({
            title: data.title,
            body: data.body,
            type: data.type,
            tags: data.tags,
            author: data.userId,
            status: 'draft'
        });

        if (data.files) {
            content.attachments = await this.processAttachments(data.files);
        }

        await content.save();
        return content;
    }

    async publishContent(contentId) {
        const content = await Content.findById(contentId);
        content.status = 'published';
        content.publishedAt = new Date();
        await content.save();

        await this.notifySubscribers(content);
        return content;
    }

    async processAttachments(files) {
        return Promise.all(files.map(async file => {
            const stored = await storageService.uploadFile(file);
            return {
                url: stored.url,
                type: file.mimetype,
                size: file.size
            };
        }));
    }
}
