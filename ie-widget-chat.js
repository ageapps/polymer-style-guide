IEWidgetChat = Polymer({
    is: 'ie-widget-chat',
    properties: {
        chatItems: {
            type: Array,
            computed: 'processHistoryData(historyData)',
            observer: 'messagesRendered'
        },
        roomId: {
            type: String,
            value: ""
        },
        // raw history data
        rawHistory: {
            type: Array,
            observer: '_rawHistoryChanged'
        },
        // data extracted and sorted
        historyData: {
            type: Array,
            value: null
        },
        historyButtonText: {
            type: String,
            value: "Load previous messages"
        },
        moreHistoryAvailable: {
            type: Boolean,
            value: false,
            observer: '_reloadHistoryButton'
        },
        readingChat: {
            type: Boolean,
            value: false
        },
        fetchingHistory: {
            type: Boolean,
            value: false,
        },
    },
    // message genarator behavior
    behaviors: [MmtvMixinComponent],

    listeners: {
        // listen to scroll status and define readingChat
        'chatFeed.scroll': 'checkScrollStatus',
    },

    /**
     * IO message types this component should receive
     * @property properties
     * @type {Object}
     * @final
     **/
    MESSAGE_SUBSCRIPTIONS: [
        'CHAT',
        'ACTIVITY',
        'ROOM_OPEN',
    ],
    /**
     * Maximum time to callpase messages, in minutes
     * @method COLLAPSIBLE_MAX_TIME
     * @final
     **/
    COLLAPSIBLE_MAX_TIME: 2,
    ready: function() {
        // var component = this;
        // this.chatItems = DEMO_MSGS
        // If it is in videowall, generate empty
        // history data
        // if (component.inVideoWall) {
        //     component.rawHistory = [];
        // }
    },

    /**
     * OBSERVERS
     */

    /**
     * moreHistoryAvailable changed, if true, show button to load more
     * if not, show message that there is no more
     * @param  {Boolean} isMoreHistoryAvailable [description]
     * @return {[type]}                         [description]
     */
    _reloadHistoryButton: function(isMoreHistoryAvailable) {
        //console.log("_reloadHistoryButton");
        var component = this;
        if (!isMoreHistoryAvailable) {
            component.fetchingHistory = false;
        }
        component.historyButtonText = isMoreHistoryAvailable ? "Load previous messages" : "No more previous messages";
    },

    /**
     * raw history data was updated or created and
     * has to be extracted and sorted
     * @param  {[type]} rawData [description]
     * @return {[type]}         [description]
     */
    _rawHistoryChanged: function(rawData) {
        //console.log("_rawHistoryChanged");
        var component = this;
        var historyData = [];
        // get data from each raw object
        rawData.forEach(function(history) {
            historyData.push(history.data);
        });
        // sort data by time
        historyData.sort(function(obj, objnext) {
            return moment(obj._timestamp).diff(moment(objnext._timestamp));
        });

        // process extracted data
        component.historyData = historyData;
    },
    /**
     * Whenever the messages are rendered, fetchingHistory is set to false
     * @return {[type]} [description]
     */
    messagesRendered: function() {
        var component = this;
        component.fetchingHistory = false;
    },

    /**
     * MESSAGE HANDLERS
     */

    /**
     * Callback when a remote message is received.
     * @method onMessage
     * @param {Object} data
     **/
    onMessage: function(message) {
        console.log("MESSAGEEEEEEEEEE");
        //console.log(message);
        var component = this;
        switch (message.type) {
            case MESSAGE_TYPE_CHAT:
                component._onChatMessage(message);
                break;
            case MESSAGE_TYPE_ACTIVITY:
                component._onActivityMessage(message);
                break;
            case MESSAGE_TYPE_ROOM_OPEN:
                component._onRoomOpen(message);
                break;
            default:
        }
        this.scrollToBottom();
    },
    _onChatMessage: function(message) {
        console.log("_onChatMessage");
        var component = this;
        var messageReceived = message;
        // Check for collapse chat message with the last showed
        if (component.chatItems && component.chatItems.length > 0) {
            const latItem = component.chatItems[component.chatItems.length - 1];
            if (message._from && message._from === latItem._from &&
                component.checkCollapsibleTime(latItem._timestamp, message._timestamp) &&
                latItem.type == MESSAGE_TYPE_CHAT) {
                messageReceived.collapse = true;
            }
        }
        // add message to feed
        component.push('chatItems', messageReceived);
        console.log("Pushed: " + messageReceived.text);
        // console.log(component.chatItems);
    },
    _onActivityMessage: function(message) {
        console.log("_onActivityMessage");
        var component = this;
        var messageReceived = message;
        // add message to feed
        const lastItem = component.chatItems[component.chatItems.length - 1];
        // Check for collapse activity message with the last showed
        if (component.checkSameDay(message._timestamp, lastItem._timestamp) &&
            lastItem.type === MESSAGE_TYPE_ACTIVITY) {
            messageReceived.collapse = true;
        }
        component.push('chatItems', messageReceived);
        console.log("Pushed: " + messageReceived.text);
        // console.log(component.chatItems);
    },
    _onRoomOpen: function(message) {
        var component = this;
        //console.log("_onRoomOpen");
        // set roomId
        component.roomId = message.data._id;
        // get old chat data
        component.getRoomWithHistory(message.data._id).then(function(data) {
            // set if there is more data to load
            if (data[component.roomId].history.length > 0) {
                component.moreHistoryAvailable = true;
                // retrieve raw data and process it
                component.rawHistory = data[component.roomId].history;
            } else {
                component.moreHistoryAvailable = false;
            }
        });
    },
    /**
     * DATA PROCESSING
     */
    processHistoryData: function(chatData) {
        //console.log("processHistoryData");

        var component = this;
        if (!chatData || chatData.length === 0) return [];
        // first element is from another date
        chatData[0].otherday = true;

        for (var i = 0; i < chatData.length; i++) {

            if (i <= chatData.length - 2) {
                // Check for collapse on text messages: same 2 minutes + same authos + both chat
                if (chatData[i]._from && chatData[i]._from === chatData[i + 1]._from &&
                    component.checkCollapsibleTime(chatData[i]._timestamp, chatData[i + 1]._timestamp) &&
                    chatData[i].type != MESSAGE_TYPE_ACTIVITY &&
                    chatData[i + 1].type != MESSAGE_TYPE_ACTIVITY) {
                    chatData[i + 1].collapse = true;
                    console.log(chatData[i].text + " collapsable: " + true);
                }

                // Check for collapse on activity messages: same day + both activity
                if (component.checkSameDay(chatData[i]._timestamp, chatData[i + 1]._timestamp) &&
                    chatData[i].type === MESSAGE_TYPE_ACTIVITY &&
                    chatData[i + 1].type === MESSAGE_TYPE_ACTIVITY) {
                    chatData[i + 1].collapse = true;
                }

                // Check for next day marker
                if (!component.checkSameDay(chatData[i]._timestamp, chatData[i + 1]._timestamp)) {
                    chatData[i + 1].otherday = true;
                } else {
                    chatData[i + 1].otherday = false;
                }
            }
            // check for mentions and highlight them
            if (!chatData[i].mentionHiglight && chatData[i].mentions && chatData[i].mentions.length > 0) {
                chatData[i].mentions.forEach(function(mention) {
                    const ment = "@" + mention.name;
                    const mentProcss = "<span class='mention'>@" + mention.name + "</span>";
                    chatData[i].text = chatData[i].text.replace(ment, mentProcss);
                    chatData[i].mentionHiglight = true;
                });
            }
            // if (!chatData[i].resource) chatData[i].resource = null;
        }
        // check if user is reading chat, if not, scroll to end,
        // if he is loading old messages, scroll to top
        if (!component.readingChat) {
            component.scrollToBottom();
        } else if (component.fetchingHistory) {
            component.scrollToTop();
        }
        console.log("CHAT HISTORY");
        console.log(chatData);
        return chatData;
    },

    /**
     * EVENTS
     */

    loadMoreHistory: function() {
        //console.log("loadMoreHistory");

        var component = this;
        // set state fetchingHistory to true
        component.fetchingHistory = true;

        // get older History
        component.getMoreHistory({
            room: component.roomId
        }).then(function(data) {
            if (data.length > 0) {
                // add new history raw data and process it
                component.rawHistory = component.rawHistory.concat(data);
            } else {
                component.moreHistoryAvailable = false;
            }
        });
    },

    /**
     * LISTENERS
     */

    /**
     * Whenever the user scrolls, check if he is checking other messages,
     * this will avoid scroll forcing
     */
    checkScrollStatus: function() {

        var component = this;
        if (component.isReadingPrevMsg()) {
            component.readingChat = true;
        } else {
            component.readingChat = false;
        }
    },


    /**
     * AUXILIAR METHODS
     */

    /**
     * Force scroll down to the most recent messages
     * @method scrollToLast
     **/
    scrollToBottom: function() {
        //console.log("scrollToBottom");

        var component = this;
        window.setTimeout(function() {
            // force chatFeed element scroll to botttom
            component.$.chatFeed.scrollTop = component.$.chatFeed.scrollHeight;
        }, 250);
    },
    /**
     * Force scroll up to the oldest messages
     * @method scrollToLast
     **/
    scrollToTop: function() {
        //console.log("scrollToTop");

        var component = this;
        // force chatFeed element scroll to top
        component.$.chatFeed.scrollTop = 0;
    },

    /**
     * Check if two times belong to the same calendar day
     * @method checkSameDay
     * @param {Date} date1
     * @param {Date} date2
     **/
    checkSameDay: function(timestamp, timestampnext) {
        return moment(timestamp).date() === moment(timestampnext).date()
    },

    /**
     * Check if two times fall within the maximum collapsing time
     * @method checkCollapsibleTime
     * @param {Date} date1
     * @param {Date} date1
     * @uses COLLAPSIBLE_MAX_TIME
     **/
    checkCollapsibleTime: function(timestamp, timestampnext) {
        var component = this;
        return component.checkSameDay(timestamp, timestampnext) && Math.abs(moment(timestamp).diff(moment(timestampnext), 'minutes')) < component.COLLAPSIBLE_MAX_TIME
    },
    /**
     * Evaluates if user is reading old messages according to the distance of the scroll to the last received message
     * @method isReadingPrevMsg
     **/
    isReadingPrevMsg: function() {
        var component = this;
        //Factor should change according to desired behaviour: when we consider user is reading?
        return this.$.chatFeed.scrollTop < this.$.chatFeed.scrollHeight - 1.5 * this.$.chatFeed.clientHeight;
    },
});
