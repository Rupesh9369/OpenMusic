package com.k4music.android.ui.components.themed

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.k4music.android.preferences.PlayerPreferences
import com.k4music.android.utils.AppUpdate
import com.k4music.android.utils.medium
import com.k4music.android.utils.toast
import com.k4music.core.ui.LocalAppearance
import kotlinx.coroutines.launch

/** Popup when update-android.json names a newer version (not shown again for a skipped version). */
@Composable
fun UpdateCard(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val release by AppUpdate.available.collectAsState()
    LaunchedEffect(Unit) { runCatching { AppUpdate.refresh() } }
    val found = release?.takeIf { it.version != PlayerPreferences.skippedUpdateVersion } ?: return
    val (_, typography) = LocalAppearance.current
    DefaultDialog(onDismiss = { AppUpdate.skip(found) }, modifier = modifier) {
        BasicText(found.title, style = typography.s.medium)
        BasicText("Version ${found.version}", style = typography.xs.medium)
        if (found.description.isNotBlank()) BasicText(found.description, style = typography.xs.medium)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            SecondaryTextButton(text = found.updateLabel, onClick = { AppUpdate.open(context, found) })
            SecondaryTextButton(text = found.skipLabel, onClick = { AppUpdate.skip(found) })
        }
    }
}

/** Settings: shows the installed version and checks now. */
@Composable
fun CheckUpdateButton(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val release by AppUpdate.available.collectAsState()
    SecondaryTextButton(
        text = release?.let { "Update ${it.version} available: download" } ?: "Check for updates (installed ${AppUpdate.currentVersion})",
        modifier = modifier,
        onClick = {
            val known = release
            if (known != null) {
                AppUpdate.open(context, known)
            } else {
                scope.launch {
                    runCatching { AppUpdate.refresh(force = true) }
                        .onSuccess { found ->
                            if (found != null) AppUpdate.open(context, found)
                            else context.toast("You have the latest version (${AppUpdate.currentVersion})")
                        }
                        .onFailure { context.toast("Could not check for updates. Are you online?") }
                }
            }
        }
    )
}
