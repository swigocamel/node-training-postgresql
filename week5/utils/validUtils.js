const isValidString = (value) => {
    return typeof value === 'string' && value.trim() !== '';
  }
  
// 可增加其他檢查: 例如正整數
const isNumber = (value) => {
    return typeof value === 'number' && !isNaN(value);
  }

module.exports = {
    isValidString,
    isNumber
}