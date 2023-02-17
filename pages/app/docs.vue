<template>
<div>
    <card
    title="Welcome to the IoT Platafarom"
    subTitle="This is a guide about how to use the plataform">

    <ul>
        <p class="text-success">THE PAGES</p>
        <li class="text-danger">Dashboard</li>
        <p>In this page you will see reendered the template that you previously created for the SELECTED DEVICE.</p>

        <li class="text-danger">Devices</li>
        <p>In devices page you can create a new device and view your created devices. 
            You can configure whether the data send for the device is saved on database or not by changing the SAVER RULE status.
            In order to create a device you need link it to a TEMPLATE.
        </p>

        <li class="text-danger">Templates</li>
        <p>A template is a set of WIDGETS, and each widget is responsable for a individual VARIABLE of your device. In this page you can create templates by configuring the parameters for a set widgets. Basically you hace widgets for show realtime data (Boolean Indicator or Realtime Numberchart) and others for send actions to your device (Button). Also, from this page you will be able to set the FREQUENCY wich the device send data.
        </p>
        <li class="text-danger">Alarms</li>
        <p>By creating an alarm, you will be notified in real time when a given variable of your device breaks the rule that you specified. Is mandatory to set the TRIGGER TIME parameter
            to preven infinites notifications. This parameter sepcify how much time has to pass before making a new notification.
        </p>
        <li class="text-danger">Notifications</li>
        <p>This page is just a simple table listing all the historic notifications you recived</p>
        <li class="text-danger">Profile</li>
        <p>
            In the profile page you will see your data entered when you registered. The page allows to you to modified the information and add some other but you must have an email a name and at least one numer phone registered (it must be the PHONE01).
            You can have up to three number phones and them will be used for the system to notifiy the alarms that you have created 
        </p>
        <p class="text-success">HOW TO USE CORRECTY</p>
        <p>To start, you have to define a template. A template is generic and reusable for several devices. Now you are able to create a device and link it to the template (we are assuming that the device manages the variables you define in the template)
            If you wanna recive realtime notifications and watching your variables you need to create an alarm.
        </p>
        
    </ul>
    </card>
</div>
</template>


<script>
import Card from '../../components/Cards/Card.vue'
export default {
  components: { Card },
    middleware:'authtenticated',
}
</script>