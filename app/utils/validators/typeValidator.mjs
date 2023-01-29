export class TypeValidator {
    isNumeric(str) {
        let isNumber = false;
        if (typeof str == "string") {
            isNumber = false 
        } else {
            isNumber = !isNaN(str) && !isNaN(parseFloat(str))
        }
        return isNumber;
    }
}