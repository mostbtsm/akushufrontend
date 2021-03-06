import { Component } from "react";
import Footer from './Layout/footer';
import Header from './Layout/header';
import axios from 'axios';
import Preloader from './Layout/preloader'

const baseurl = process.env.REACT_APP_API_BASE_URL;

class ApplyEvent extends Component{

    constructor(props)
    {
        super(props);
        this.state = {
            loading:false,
            type:"normal",
            detailevent:{
                fields:{
                    date:""
                }
            },
            email:"",
            surname:"",
            lastname:"",
            surnameFurigana:"",
            lastnameFurigana:"",
            gender:"1",
            phone:"",
            birthday:""  
        }
    }

    componentDidMount(){
        const {id} = this.props.match.params;
        this.getEventdetail(id);
        this.getUserdata();
    }

    getUserdata()
    {
        var userData = JSON.parse(localStorage.userData);
        var token = userData.token
        var config = {
            method: 'get',
            url: `${baseurl}/api/account/profile`,
            headers: { 
            'Authorization': 'Bearer ' + token,
            },
                data : {},
        };
        axios(config)
        .then((response) => {
            var userData = response.data.user;
            const {name1, name2, kana1, kana2,  gender, phone, birthday} = userData
                    
            this.setState({
                loading:false,
                surname:name1,
                lastname:name2,
                surnameFurigana:kana1,
                lastnameFurigana:kana2,
                gender:gender? `${gender}` : "1",
                phone:phone,
                birthday:birthday,
                email:userData.email,
                
            })
        })
        .catch((error)=>{
            this.setState({
                loading:false
            })
            if (error.response) {
                if(error.response.status===401){
                    localStorage.removeItem("userData");
                    window.location.assign('/');
                }
            }
        })
    }

    getEventdetail(id){
        this.setState({loading:true})      
        var userData = JSON.parse(localStorage.userData);
        var token = userData.token;
        var config = {
            method: 'get',
            url: `${baseurl}/api/event/${id}`,
            headers: { 
                'Authorization': 'Bearer ' + token
            },
            data:{}
        };
        
        axios(config)
        .then((response) => {
            var responseData = JSON.parse(response.data.event)[0]
            this.setState({
                loading:false,
                detailevent:responseData
            });
        })
        .catch((error)=>{
            this.setState({loading:false});
            if (error.response) {
                if(error.response.status===401){
                    localStorage.removeItem("userData");
                    window.location.assign('/');
                }
            }
        })
    }

    handleApply = (e)=>{
        this.setState({loading:true})
        const {email, surname,lastname, surnameFurigana, lastnameFurigana, phone, gender} = this.state
        var userData = JSON.parse(localStorage.userData);
        var token = userData.token;
        var data = JSON.stringify({
            "email":email,
            "surname":surname,
            "lastname":lastname,
            "surnameFurigana":surnameFurigana,
            "lastnameFurigana":lastnameFurigana,
            "phone":phone,
            "gender":gender,
            "type":"1"
        });

        var config = {
          method: 'post',
          url: `${baseurl}/api/event/apply/${this.props.match.params.id}`,
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          data : data
        };

        axios(config)
        .then((response)=>{
            console.log(response);
            this.setState({loading:false});
        })
        .catch((error)=>{
            this.setState({
                loading:false
            });
            if (error.response) {
                if(error.response.status===401){
                    localStorage.removeItem("userData");
                    window.location.assign('/');
                }
            }
        });
    }

    render(){
        const { loading, detailevent,surname, lastname, surnameFurigana, lastnameFurigana, gender, phone, email} = this.state
        return(
            <>
                 <div className="container">
                    <Header pageName="????????????????????????"/>
                    <div className="seminar-card-container">
                        <div className="seminar-card">
                            <h2>{detailevent.fields.title}</h2>
                            <div className="seminar-detail-desc">
                                <h3>????????????</h3>
                                <p>{`${detailevent.fields.date.slice(0,10).replaceAll("-", "/")}  ${detailevent.fields.start_time} ~ ${detailevent.fields.end_time}`}</p>
                            </div>
                            <div className="seminar-detail-desc">
                                <h3>??????</h3>
                                <p>{detailevent.fields.location_room_name}</p>
                            </div>
                            <div className="seminar-detail-desc">
                            <p>{detailevent.fields.location_building_name}</p>
                            </div>
                            <div className="seminar-detail-desc">
                                <p>{detailevent.fields.location_way}<br/>
                                    {detailevent.fields.location_detail_link !=="" && <a target="_blank" className="seminar-detail-link" href={detailevent.fields.location_detail_link}>{detailevent.fields.location_detail_link}</a>}
                                </p>
                            </div>
                        </div>
                        <div className="seminar-card">
                            <h3>?????????</h3>
                            <div className="seminar-part-type">
                                <div onClick={(e)=>{this.setState({type:"normal"})}} className={this.state.type=="normal" ? "seminar-part-type-detail seminar-part-type-focused" :"seminar-part-type-detail"}>
                                    <div><div></div></div>
                                    <div>??????????????????{detailevent.fields.fee}???</div>
                                    <div></div>
                                </div>
                                <div onClick={(e)=>{this.setState({type:"member"})}} className={this.state.type=="member" ? "seminar-part-type-detail seminar-part-type-focused" :"seminar-part-type-detail"}>
                                    <div><div></div></div>
                                    <div>?????????0???</div>
                                </div>
                            </div>
                        </div>
                        <div className="seminar-card">
                            <h3>???????????????</h3>
                            <div className="seminar-part-info">
                                <label htmlFor="">??????????????????????????????????????????</label>
                                <input type="email" disabled  defaultValue={email} />
                            </div>
                            <div className="seminar-part-info">
                                <label htmlFor="">?????????</label>
                                <input type="text" disabled  defaultValue={surname + lastname} />
                            </div>
                            <div className="seminar-part-info">
                                <label htmlFor="">????????? ????????????</label>
                                <input type="text" disabled defaultValue={surnameFurigana + lastnameFurigana} />
                            </div>
                            <div className="seminar-part-info">
                                <p htmlFor="">??????</p>
                                <div className="seminar-part-info-radio">
                                    <label htmlFor="female">
                                        <input type="radio" name="sex" disabled id="female" checked={gender==="1"}/>
                                        <span></span>
                                        ??????
                                    </label>
                                    <label htmlFor="male">
                                        <input type="radio" name="sex" disabled id="male" checked={gender==="0"} />
                                        <span></span>
                                        ??????
                                    </label>
                                </div>
                            </div>
                            <div className="seminar-part-info">
                                <label htmlFor="">????????????????????????????????????????????????</label>
                                <input type="tel" disabled defaultValue={phone} />
                            </div>
                        </div>
                        <div className="seminar-card seminar-detail-check">
                            <button onClick={this.handleApply} className="seminar-detail-check-button">????????????</button>
                        </div>
                    </div>
                    <Footer/>
                </div>
                {loading &&
                    <Preloader/>
                }
            </>
        )
    }
}

export default ApplyEvent;