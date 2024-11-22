class InternationalService {
    constructor() {
        this.i18n = new I18nProvider();
        this.loadTranslations();
    }

    async translateContent(content, targetLanguage) {
        const translationService = await this.getTranslationService();
        const translated = await translationService.translate(content, targetLanguage);

        await this.cacheTranslation(content.id, targetLanguage, translated);
        return translated;
    }

    async formatForLocale(data, locale) {
        const formatter = await this.getLocaleFormatter(locale);
        return {
            currency: formatter.formatCurrency(data.amount),
            dates: formatter.formatDates(data.dates),
            numbers: formatter.formatNumbers(data.numbers)
        };
    }
}
