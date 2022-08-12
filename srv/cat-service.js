const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init(){
    const {Books} = this.entities

    this.on('submitOrder', async req => {
        const {book,quantity} = req.data
        if (quantity < 1) return req.reject(400, `quantity has to be more 1 or more`)
        let b = await SELECT .from(Books,book) .columns('stock')
        if (!b) return req.error(404,`Book #${book} dosen't exist`)
        let {stock} = b
        if (quantity > stock) return req.error(409,`${quantity} cannot be greater than stock`)
        await UPDATE (Books,book) .with({ stock: stock -= quantity })
        this.emit('OrderedBook', {book, quantity, buyer:req.user.id})
        return { stock }
    })

    this.after('READ', 'ListOfBooks', each => {
        if (each.stock > 111) each.title += ` -- 11% discount!`
    })

    return super.init()
}}

module.exports = { CatalogService }