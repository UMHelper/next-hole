import CatalogNavigation from "@/components/catalog-navigation"

const CatalogLayout=({children}:{children:any})=>{
    return(
        <div className='max-w-screen-xl mx-auto p-4'>
            <div className="space-y-2">
            <h1 className="text-3xl">Catalog</h1>
            <div>
            Choose one faculty to start
            </div>
            <CatalogNavigation/>
        </div>
            {children}
        </div>
    )
}

export default CatalogLayout