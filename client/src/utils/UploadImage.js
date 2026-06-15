import Axios from '../utils/Axios'
import SummaryApi from '../Common/SummaryApi'

const uploadImage = async(image)=>{
    try {
        const formData = new FormData()
        formData.append('image',image)

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data : formData
        })

        return response
    } catch (error) {
        console.error("Upload error:", error)
        return null
    }
}

export default uploadImage