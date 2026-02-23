const factorial = num =>{
    return( num === 0) ? 1 : num * factorial(num-1)
}
export default factorial;