<template>
  <div v-if="isLoading == false">


    <v-container>
      <v-row justify="center" class="mt-4">
        <h1>Ваше расписание </h1>
      </v-row>
      <div>
        <v-sheet
          tile
          height="54"
          class="d-flex"
        >
          <v-btn
            icon
            class="ma-2"
            @click="calendarPrevPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <div class="d-flex align-center text-center">Неделньный график
              <v-btn
                color="primary"
                fab
                x-small
                outlined
                style="border: none !important;"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
          <div class="d-flex align-center text-center">Сменный график
            <v-menu
              v-model="sessionMenu"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              fab
              v-bind="attrs"
              v-on="on"
              x-small
              outlined
              style="border: none !important;"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
              </template>
              <v-card>
                <v-card-text class="d-flex flex-column">
                  Введите переодичность
                  <div class="d-flex align-center text-center">
                  <v-text-field  v-model="periodStart" style="width:36px" hide-details outlined dense></v-text-field>
                    <div class="ml-2 mr-2" style="vertical-align: middle !important">Через</div>
                  <v-text-field v-model="periodEnd" style="width:36px" hide-details outlined dense></v-text-field>
                  </div>
                  Выберите дату начала
                  <DatePicker v-model="startValue"></DatePicker>
                  <v-btn
                    class="mt-2"
                    style="color: white !important;"
                    color="#a60dbf"
                    elevation="2"
                    @click="addSchedule"
                  >Сохранить</v-btn>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>

          </div>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-btn>РЕДАКТИРОВАТЬ</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            icon
            class="ma-2"
            @click="calendarNextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="value"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            locale="ru-RU"

          >

            <template v-slot:day-label="{ day, date, month}">
              <div v-if="value.split('-')[1] == month" >
                <div v-if="dataForEveryDay[date].working === true" style="background-color: #27AE60; color:white">{{day}}</div>
                <div  v-if="dataForEveryDay[date].working === false" style=" color:black">{{day}}</div>
              </div>
            </template>
            <template v-slot:day="{date, month}">
              <div v-if="value.split('-')[1] == month" >
              <div style="font-size: 0.8rem" v-if="dataForEveryDay[date].ranges !== null">{{ dataForEveryDay[date].ranges[0] }}</div>
              </div>
            </template>



          </v-calendar>
        </v-sheet>
      </div>

    </v-container>
  </div>
</template>

<script>
import axiosInstance from "@/plugins/axios";
import DatePicker from "@/components/inputs/DatePicker";

export default {
  name: "Schedule",
  components:{DatePicker},
  data(){
    return{
      value:new Date().toISOString().split('T')[0] ,
      sessionMenu:false,
      startValue:'',
      periodStart:null,
      periodEnd:null,
      isLoading:false,
      periodData:[],
      timeData:[],
      calendarData:[],
      dataForEveryDay:{},

    }
  },
  watch:{
    value(){
      this.fetchData()
    }

  },
  methods:{
      calendarNextPage(){

       this.$refs.calendar.next()
    },
     calendarPrevPage(){

      this.$refs.calendar.prev()
    },
    async fetchData(){
      this.isLoading = true
      await axiosInstance.get(`work_schedules/schedules/actual/${this.value.split('-')[0]}/${this.value.split('-')[1]}`)
        .then(  (response)=>{
          this.calendarData = response.data
          for (let i = 0; i < this.calendarData.length; i++){
            this.dataForEveryDay[this.calendarData[i].date.split('.').reverse().join('-')] = {working : this.calendarData[i].working, special : this.calendarData[i].special, start: this.calendarData[i].start , ranges: this.calendarData[i].ranges}
          }
        })
      .finally(()=>{
        this.isLoading = false
      })
    },

    calculateTimeData(){
      this.timeData = []
      for (let i = 0; i < this.periodStart; i++){
        this.timeData.push(['09:00-18:00'])
      }
      for (let i = 0; i < this.periodEnd; i++){
        this.timeData.push(null)
      }
    },
    calculatePeriodData(){
      this.periodData = []
      for (let i = 0; i < this.periodStart; i++){
        this.periodData.push(true)
      }
      for (let i = 0; i < this.periodEnd; i++){
        this.periodData.push(false)
      }
    },
    async addSchedule(){
      await this.calculateTimeData()
      await this.calculatePeriodData()
      await axiosInstance.post('work_schedules/schedules/',{
        start: this.startValue,
        schedule_days: this.periodData,
        schedule_time: this.timeData
      })
    },
  },
  async mounted(){
   this.isLoading = true
   await axiosInstance.get(`work_schedules/schedules/actual/${new Date().getFullYear()}/${new Date().getMonth() + 1}`)
    .then(  (response)=>{
      this.calendarData = response.data
       for (let i = 0; i < this.calendarData.length; i++){
         this.dataForEveryDay[this.calendarData[i].date.split('.').reverse().join('-')] = {working : this.calendarData[i].working, special : this.calendarData[i].special, start: this.calendarData[i].start, ranges: this.calendarData[i].ranges}
       }

    })

   this.isLoading = false

  },
};
</script>

<style scoped>

</style>