# Using the Line Listing app

The Line Listing app is a new app that replaces the line listing functionality in the Event Reports app, but also offers a lot more.

**_NOTE: There will be a forward compatibility with the Event Reports app, which means that you can open the existing event reports of type line list in the Line Listing app, but you cannot save them under the Line Listing app._**

### Creating and editing a line list

When you open the Line Listing app from the DHIS2 menu, you are presented with a blank slate, and you can start creating a line list.

![alt_text](resources/images/image5.png 'image_tooltip')

## Creating a line list

### Line list

In the Line Listing app, you currently only have one type of selection which is Line list.

![alt_text](resources/images/image24.png 'image_tooltip')

### Input

(_Is same as output which you see in existing event report app_). When you open the input tab you will see below two options:

-   Event (see individual event data from a Tracker program stage or event program)
-   Enrollment (see data from multiple program stages in a Tracker program)

![alt_text](resources/images/image7.png 'image_tooltip')

### Program Dimensions

(In the event report we called it a data dimension.)

The line list will always be based on the event or tracker programs and you can do analysis on a range of dimensions. For Program with category combinations, you can use program categories and category option group sets as dimensions.

**_NOTE: In the new app, all the dimensions related to a tracker or an event program are present in the program dimension component._**

-   Select Program Dimension

    Select program: All the event and tracker programs will be visible in the drop down.

    If you have selected the Event in Input tab, then for tracker programs under program dimension you need to select the program stage to get all the data elements, attributes for that particular stage. In this you are not allowed to select data from the cross – stage for the tracker program.

**_NOTE : If you select the event program you don’t have to select the stage unlike the event report app where you have to select the stage for the event program also._**

![alt_text](resources/images/image9.png 'image_tooltip')

-   But if you select Enrollment in the Input tab then all data elements associated with the program will be available from different stages within the program for the purpose of cross stage selection of data elements. Each data element will act as a dimension.

![alt_text](resources/images/image8.png 'image_tooltip')

-   If you want to filter the data, by data elements, program attribute, program indicators, category, category option group set you can do it by clicking on the dropdown option.

![alt_text](resources/images/image11.png 'image_tooltip')

-   The data elements can be added by clicking on a dimension, by dragging and dropping a dimension to the layout area or by hovering over a dimension and using on its context menu (three dots).

![alt_text](resources/images/image10.png 'image_tooltip')

Or you can click on the respective data element and you can then choose to add it in column or filter as shown in below figure.

![alt_text](resources/images/image6.png 'image_tooltip')

-   Each dimension can have criteria (filters). Data elements of the type option set allows for "in" criteria, where multiple options can be selected.

![alt_text](resources/images/image12.png 'image_tooltip')

-   Numeric values can be compared to filter values using greater than, equal or less than operators. (Optional) For each data element, specify a filter with operators such as "greater than", "in" or "equal" together with a filter value.

    The enhancement in this feature is that you can add multiple conditions and there are also different operators which can be used. You can also filter by empty or not empty.

![alt_text](resources/images/image13.png 'image_tooltip')

-   In the Line Listing app for BOOLEAN type data element, here in the analysis it will show “Yes”, ”No”, ”Not answered” instead of 0 and 1 as in the Event Reports app or the Data Visualizer app.

![alt_text](resources/images/image14.png 'image_tooltip')

![alt_text](resources/images/image16.png 'image_tooltip')

-   The line list will be displayed as a table with one row per event. Each dimension can be used as a column in the table or as a filter.

![alt_text](resources/images/image22.png 'image_tooltip')

### Your Dimension

All **Organisation Unit group sets** are present under **Your dimension** component for further evaluation or analysis.

### Main Dimensions

#### Select Organization Unit

The organisation unit dialog is flexible, offering essentially three ways of selecting organisation units:

-   Explicit selection: Use the **tree** to explicitly select the organisation units you want to appear in the visualization. If you right-click on an organisation unit you can easily choose to select all org units below it.
-   Levels and groups: The **Level** and **Group** dropdowns are a convenient way to select all units in one or more org unit groups or at specific levels. Example: select *CH Mahosot* (level 3) to get all org units at that level.

    _NOTE: Please note that as soon as at least one level or group has been selected the org unit tree now acts as the boundary for the levels/groups. Example: if you select CH Mahosot (level 3) and Vientiane Capital org unit (at level 2) in the tree you get all units inside that district._

-   The user's organisation units:
-   User organisation unit: This is a way to dynamically select the org units that the logged in user is associated with.
-   User sub-units: Selects the subunits of the user organisation unit.
-   User sub-x2-units: Selects the units two levels below the user organisation unit.

![alt_text](resources/images/image18.png 'image_tooltip')

#### Event Status

Filters data based on the event status:  **Active**, **Completed**.

-   You can visualize the data based on the event status

![alt_text](resources/images/image19.png 'image_tooltip')

#### Program Status

Filters data based on the program status: **Active**, **Completed** or **Cancelled**.

![alt_text](resources/images/image20.png 'image_tooltip')

#### Created by / Last updated by

Will display the data based on who created the particular event.

### Time Dimensions

This is a new feature in Line Listing app where you will be able to view the data on the basis of different time dimensions.

-   Event date/Report Compilation date
-   Date patient notified in the health system.
-   Incident date
-   Last updated on

You can click on the above time dimension to visualize data on different period dimension, a window will open where you can select one or several periods.

You have three period options: relative periods, fixed periods and start/end dates. You can combine fixed periods and relative periods in the same table You cannot combine fixed periods and relative periods with start/end dates in the same table Overlapping periods are filtered so that they only appear once.

-   Fixed periods: In the **Select period type** box, select a period type. You can select any number of fixed periods from any period type. Fixed periods can for example be "January 2021".
-   Relative periods: In the lower part of the **Periods** section, select as many relative periods as you like. The names are relative to the current date. This means that if the current month is March and you select **Last month**, the month of February is included in the chart. Relative periods have the advantage that it keeps the data in the report up to date as time goes.
-   Start/end dates: Next to Choose form presets, select **Start/end dates**. This period type lets you specify flexible dates for the time span in the report.

![alt_text](resources/images/image21.png 'image_tooltip')

### Column Header

You can sort on all column headers

You can filter the specific column by directly clicking the data elements or attributes at the column and you will be able to sort the data values

**For Example:**

In the below screenshot, we have selected AEFI – Headache.

![alt_text](resources/images/image22.png 'image_tooltip')

Once we click on AEFI – Headache we will get a dialog box where we need to select the option we want to filter out. In this we have selected “Yes” only.

![alt_text](resources/images/image23.png 'image_tooltip')

Once we click on update, we will get the line list with only “Yes” under AEFI – Headache.

![alt_text](resources/images/image1.png 'image_tooltip')

### Repeatable Events

This is a new feature in the Line Listing app.

If the program stage has a data element in a repeatable event you can click on the data element and the window will open up where you will be able to see the Repeated event tab

![alt_text](resources/images/image2.png 'image_tooltip')

Then, you can define the most recent events and the oldest events you want in the output as displayed below.

![alt_text](resources/images/image3.png 'image_tooltip')

Once you click on update you will be able to visualize the events of this repeatable program stage as shown below.

![alt_text](resources/images/image4.png 'image_tooltip')
