<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeviceOfflineAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $messageBody;

    /**
     * Create a new message instance.
     */
    public function __construct(string $messageBody)
    {
        $this->messageBody = $messageBody;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this
            ->subject('Device Offline Alert')
            ->html($this->messageBody);
    }
}
