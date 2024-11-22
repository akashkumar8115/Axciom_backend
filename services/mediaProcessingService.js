class MediaProcessingService {
    async processMedia(file, type) {
        const processedFile = await this.optimizeMedia(file, type);
        const variants = await this.generateVariants(processedFile, type);

        return {
            original: await this.uploadToStorage(processedFile),
            variants: await Promise.all(variants.map(v => this.uploadToStorage(v))),
            metadata: await this.extractMetadata(processedFile)
        };
    }

    async generateThumbnails(mediaId) {
        const media = await Media.findById(mediaId);
        const sizes = [
            { width: 100, height: 100 },
            { width: 300, height: 300 },
            { width: 600, height: 600 }
        ];

        const thumbnails = await Promise.all(
            sizes.map(size => this.createThumbnail(media.url, size))
        );

        media.thumbnails = thumbnails;
        await media.save();
        return thumbnails;
    }
}
