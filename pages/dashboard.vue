<template>
    <div>
        <h2>
            Dashboard
        </h2>
        <iot-indicator></iot-indicator>
        <iot-button></iot-button>

    </div>
</template>

<script>
import IotButton from '../components/Widgets/IotButton.vue'
import IotIndicator from '../components/Widgets/IotIndicator.vue'
import RtnumberChart from '../components/Widgets/RtnumberChart.vue'

export default {
    components:{
        IotIndicator,
        IotButton,
        RtnumberChart
    }
    
}
