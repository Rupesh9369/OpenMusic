package com.k4music.android.service

import androidx.annotation.OptIn
import androidx.media3.common.C
import androidx.media3.common.audio.AudioProcessor.AudioFormat
import androidx.media3.common.audio.BaseAudioProcessor
import androidx.media3.common.util.UnstableApi
import java.nio.ByteBuffer
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * 8D / 16D: the sound travels left and right around the head. Equal-power gains follow a slow sine,
 * so one full swing takes 1 / [turnsPerSecond] seconds (8 s at 0.125, 16 s at 0.0625). Mono and
 * non-16-bit input bypass. 0 turns per second leaves the audio untouched.
 */
@OptIn(UnstableApi::class)
class SpatialPanner : BaseAudioProcessor() {
    /** Read on the audio thread. */
    @Volatile
    var turnsPerSecond = 0f

    private var sampleRate = 44100
    private var frame = 0L

    override fun onConfigure(inputAudioFormat: AudioFormat): AudioFormat {
        sampleRate = inputAudioFormat.sampleRate
        frame = 0L
        return if (inputAudioFormat.encoding == C.ENCODING_PCM_16BIT && inputAudioFormat.channelCount == 2) inputAudioFormat
        else AudioFormat.NOT_SET
    }

    override fun queueInput(inputBuffer: ByteBuffer) {
        val size = inputBuffer.remaining()
        if (size == 0) return
        val output = replaceOutputBuffer(size)
        val rate = turnsPerSecond
        if (rate <= 0f) {
            output.put(inputBuffer)
        } else {
            val step = 2 * PI * rate / sampleRate
            while (inputBuffer.remaining() >= 4) {
                // Pan position runs -1 (left) .. +1 (right); the angle maps it onto a quarter circle.
                val angle = (sin(step * frame) + 1) * PI / 4
                val gainLeft = (sqrt(2.0) * cos(angle)).toFloat()
                val gainRight = (sqrt(2.0) * sin(angle)).toFloat()
                val left = inputBuffer.getShort().toFloat()
                val right = inputBuffer.getShort().toFloat()
                output.putShort(softClip(left * gainLeft))
                output.putShort(softClip(right * gainRight))
                frame++
            }
            output.put(inputBuffer)
        }
        output.flip()
    }
}
