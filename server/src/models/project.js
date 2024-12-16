export class Project {
    name;
    description;
    imgUrl;
    domainId;
    licenseId;
    languageId;

    constructor(name, description, imgUrl, domainId, licenseId, languageId) {
        this.name = name;
        this.description = description;
        this.imgUrl = imgUrl;
        this.domainId = domainId;
        this.licenseId = licenseId;
        this.languageId = languageId;
    }
}