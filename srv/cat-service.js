const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init(){
    const {Books} = this.entities

    this.on('submitOrder', async req => {
        const {book,quantity} = req.data
        if (quantity < 1) return req.reject(400, `QUANTITY_MORE_THAN_ZERO`)
        let b = await SELECT .from(Books,book) .columns('stock')
        if (!b) return req.error(404,`INVALID_BOOK`,[book])
        let {stock} = b
        if (quantity > stock) return req.error(409,`QUANTITY_MORE_THAN_STOCK`)
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