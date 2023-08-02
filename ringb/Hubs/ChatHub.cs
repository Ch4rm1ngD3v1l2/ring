using Microsoft.AspNetCore.SignalR;

namespace ringb.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string id, object message)
        {
            await Clients.OthersInGroup(id).SendAsync("ReceiveMessage", message);
        }
        public async Task JoinRoom(string id)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, id);
        }
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
